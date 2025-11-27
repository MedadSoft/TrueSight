import os
import json
import pandas as pd
import random
from typing import List, Dict, Any
from datetime import datetime
from groq import Groq
from sqlalchemy.orm import Session
import models
import schemas

# Initialize Groq client
# API key must be set in environment variable GROQ_API_KEY
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable is required")
client = Groq(api_key=GROQ_API_KEY)

DEFAULT_PROMPT = """
ANALYZE these {transaction_count} financial transactions for fraud risk.

FOR EACH transaction, provide:
- Risk level: 🟢 LOW, 🟡 MEDIUM, or 🔴 HIGH
- Concise explanation (UNDER {max_chars} CHARACTERS)
- Focus on 2-3 key risk factors
- Consider TMLScore from source data (1-999 scale)

KEY FIELDS TO CONSIDER:
- TMLScore: Traditional ML Risk Score ({tmlscore_range})
- Amount: Transaction value
- Behavioral patterns: velocity, new beneficiaries, etc.
- Geographic risks: high-risk countries
- Device and authentication factors

TRANSACTIONS DATA:
{transactions_json}

REQUIRED RESPONSE FORMAT (STRICT TABLE FORMAT):
| Transaction_ID | Risk_Level | Explanation |
|----------------|------------|-------------|
| TXN_001 | 🟢 LOW | [Concise explanation under {max_chars} chars] |
| TXN_002 | 🟡 MEDIUM | [Concise explanation under {max_chars} chars] |
| TXN_003 | 🔴 HIGH | [Concise explanation under {max_chars} chars] |

Continue for all transactions. Maintain exact table format.
"""

def generate_sample_transactions(count: int = 10) -> List[Dict[str, Any]]:
    transactions = []
    for i in range(count):
        transaction = {
            'transaction_id': f"TXN_{random.randint(1000, 9999)}",
            'amount': random.randint(100, 20000),
            'TMLScore': 0,
            'new_beneficiary': "Yes" if random.random() > 0.7 else "No",
            'account_age_days': random.randint(1, 365),
            'high_risk_country': "Yes" if random.random() > 0.8 else "No",
            'velocity_count': random.randint(1, 20),
            'device_match': "Yes" if random.random() > 0.3 else "No",
            'auth_strength': random.choice(["Weak", "Medium", "Strong"]),
            'time_of_day': f"{random.randint(0,23):02d}:{random.randint(0,59):02d}",
            'merchant_category': random.choice(["Retail", "E-commerce", "International", "Services"])
        }
        
        # Logic for TML Score distribution
        if i < count * 0.25:
            transaction['TMLScore'] = random.randint(1, 100)
        elif i < count * 0.75:
            transaction['TMLScore'] = random.randint(301, 600)
        else:
            transaction['TMLScore'] = random.randint(801, 999)
            
        transactions.append(transaction)
    return transactions

def analyze_transactions(transactions: List[Dict[str, Any]], config: Dict[str, Any]) -> List[Dict[str, Any]]:
    BATCH_SIZE = 50
    all_results = []
    
    # print(f"DEBUG: transactions type: {type(transactions)}")
    if isinstance(transactions, dict):
        # print("DEBUG: transactions is a dict, converting to list values...")
        transactions = list(transactions.values())
    elif not isinstance(transactions, list):
        # print(f"DEBUG: transactions is {type(transactions)}, forcing list conversion...")
        transactions = list(transactions)

    # Split transactions into batches
    for i in range(0, len(transactions), BATCH_SIZE):
        batch = transactions[i:i + BATCH_SIZE]
        print(f"DEBUG: Processing batch {i//BATCH_SIZE + 1} ({len(batch)} transactions)")
        
        try:
            model = config.get('model', 'qwen/qwen3-32b')
            temperature = config.get('temperature', 0.6)
            max_tokens = config.get('maxTokens', 4096)
            
            prompt_vars = {
                'transaction_count': len(batch),
                'max_chars': 250,
                'tmlscore_range': "1-999 (1=very low, 999=suspicious)",
                'transactions_json': json.dumps(batch, indent=2)
            }
            
            prompt = DEFAULT_PROMPT.format(**prompt_vars)
            
            completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a financial crime analyst. Provide responses in exact table format as requested. Be concise and quantitative."
                    },
                    {"role": "user", "content": prompt}
                ],
                model=model,
                temperature=temperature,
                max_completion_tokens=max_tokens,
                top_p=0.95,
                stream=False
            )
            
            response_text = completion.choices[0].message.content
            # print(f"DEBUG: LLM Response (Batch {i//BATCH_SIZE + 1}):\n{response_text[:500]}...") 
            
            batch_results = parse_table_response(response_text, batch)
            all_results.extend(batch_results)
            
        except Exception as e:
            print(f"Error in analysis batch {i//BATCH_SIZE + 1}: {str(e)}")
            # Continue to next batch even if one fails
            continue
            
    return all_results

def parse_table_response(response_text: str, original_transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    results = []
    lines = response_text.strip().split('\n')
    table_start = -1
    
    # Find table start
    for i, line in enumerate(lines):
        if '|' in line and 'Transaction_ID' in line:
            table_start = i + 2 # Skip header and separator
            break
            
    if table_start == -1 or table_start >= len(lines):
        return []
        
    transaction_map = {t['transaction_id']: t for t in original_transactions}
    
    for line in lines[table_start:]:
        line = line.strip()
        if not line.startswith('|'):
            continue
            
        parts = [part.strip() for part in line.split('|') if part.strip()]
        if len(parts) < 3:
            continue
            
        txn_id = parts[0]
        risk_level_raw = parts[1]
        explanation = parts[2]
        
        # Clean risk level
        risk_level = "UNKNOWN"
        if 'LOW' in risk_level_raw.upper():
            risk_level = "LOW"
        elif 'MEDIUM' in risk_level_raw.upper():
            risk_level = "MEDIUM"
        elif 'HIGH' in risk_level_raw.upper():
            risk_level = "HIGH"
            
        if txn_id in transaction_map:
            original = transaction_map[txn_id]
            results.append({
                **original,
                'risk_level': risk_level,
                'explanation': explanation,
                'analyzed_at': datetime.utcnow().isoformat()
            })
            
    return results

def save_results_to_db(results: List[Dict[str, Any]], db: Session):
    saved_count = 0
    for res in results:
        # Create transaction record
        # Check if exists first
        existing = db.query(models.Transaction).filter(models.Transaction.transaction_id == res['transaction_id']).first()
        
        risk_score = res.get('TMLScore', 0) / 10.0 # Convert 1-999 to approx 0-100
        is_flagged = res['risk_level'] == 'HIGH'
        
        if not existing:
            db_txn = models.Transaction(
                transaction_id=res['transaction_id'],
                amount=float(res['amount']),
                transaction_type="Payment", # Default
                risk_score=risk_score,
                is_flagged=is_flagged,
                timestamp=datetime.utcnow()
            )
            db.add(db_txn)
            db.commit()
            db.refresh(db_txn)
            
            # If High Risk, create an Alert
            if is_flagged:
                # Ensure system user exists
                system_user = db.query(models.User).filter(models.User.username == "system").first()
                if not system_user:
                    system_user = models.User(
                        username="system",
                        email="system@truesight.ai",
                        hashed_password="hashed_system_password", # Placeholder
                        full_name="System Admin",
                        role="admin"
                    )
                    db.add(system_user)
                    db.commit()
                    db.refresh(system_user)
                
                alert = models.Alert(
                    alert_type="High Risk Transaction",
                    severity="high",
                    description=res['explanation'],
                    status="new",
                    created_by_id=system_user.id
                )
                db.add(alert)
                db.commit()
            
            saved_count += 1
            
    return saved_count
