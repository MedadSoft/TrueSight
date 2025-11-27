from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, get_db, Base
import models
import schemas
import analysis_service
from typing import List, Dict, Any

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TrueSight API",
    description="Fraud Analysis and Investigation Platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:5176"],  # TrueSight frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Analysis Endpoints
@app.post("/api/analysis/generate-sample")
def generate_sample_data(count: int = 10):
    return analysis_service.generate_sample_transactions(count)

@app.post("/api/analysis/run")
def run_analysis(request: Dict[str, Any], db: Session = Depends(get_db)):
    transactions = request.get('transactions', [])
    config = request.get('config', {})
    
    if not transactions:
        raise HTTPException(status_code=400, detail="No transactions provided")
        
    results = analysis_service.analyze_transactions(transactions, config)
    
    # Save results to DB
    saved_count = analysis_service.save_results_to_db(results, db)
    
    return {
        "status": "success",
        "processed_count": len(results),
        "saved_count": saved_count,
        "results": results
    }

@app.get("/")
def read_root():
    return {
        "message": "Welcome to TrueSight API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Cases endpoints
@app.get("/api/cases", response_model=List[schemas.Case])
def get_cases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    cases = db.query(models.Case).offset(skip).limit(limit).all()
    return cases

@app.post("/api/cases", response_model=schemas.Case, status_code=status.HTTP_201_CREATED)
def create_case(case: schemas.CaseCreate, db: Session = Depends(get_db)):
    # Generate case number
    case_count = db.query(models.Case).count()
    case_number = f"CASE-{case_count + 1001:04d}"
    
    db_case = models.Case(
        **case.dict(),
        case_number=case_number
    )
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case

@app.get("/api/cases/{case_id}", response_model=schemas.Case)
def get_case(case_id: int, db: Session = Depends(get_db)):
    case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

# Alerts endpoints
@app.get("/api/alerts", response_model=List[schemas.Alert])
def get_alerts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    alerts = db.query(models.Alert).offset(skip).limit(limit).all()
    return alerts

@app.post("/api/alerts", response_model=schemas.Alert, status_code=status.HTTP_201_CREATED)
def create_alert(alert: schemas.AlertCreate, db: Session = Depends(get_db)):
    # For now, set created_by_id to 1 (will be replaced with auth)
    db_alert = models.Alert(**alert.dict(), created_by_id=1)
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

# Transactions endpoints
@app.get("/api/investigation/data")
def get_investigation_data(db: Session = Depends(get_db)):
    # Get recent transactions
    transactions = db.query(models.Transaction).order_by(models.Transaction.timestamp.desc()).limit(100).all()
    
    # Get alerts to map explanations
    alerts = db.query(models.Alert).all()
    # Create a map of transaction description if we can link them. 
    # Currently Alert doesn't link to Transaction directly in the model I created earlier (it links to Case), 
    # but for this MVP analysis flow, we created Alerts from Transactions.
    # Let's update the analysis service to link them or just store explanation in Transaction for simplicity in this iteration.
    
    # Actually, let's just return the transactions and map risk score to level
    result = []
    for t in transactions:
        risk_level = "LOW"
        if t.risk_score > 80:
            risk_level = "HIGH"
        elif t.risk_score > 50:
            risk_level = "MEDIUM"
            
        # Find matching alert if any (naive matching for now since we didn't add transaction_id to Alert)
        # In a real app, we'd have a foreign key. 
        # For this MVP, let's just use the description if it's high risk
        explanation = "Analyzed by TrueSight AI"
        if t.is_flagged:
             # Try to find the alert created for this transaction
             # This is a bit hacky but works for the demo flow
             pass

        result.append({
            "id": t.transaction_id,
            "amount": t.amount,
            "risk": risk_level,
            "score": int(t.risk_score),
            "type": t.transaction_type,
            "explanation": explanation,
            "status": "New" if t.is_flagged else "Closed",
            "timestamp": t.timestamp
        })
        
    return result

@app.post("/api/transactions", response_model=schemas.Transaction, status_code=status.HTTP_201_CREATED)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    # Calculate risk score (simple example)
    risk_score = 0.0
    if transaction.amount > 10000:
        risk_score += 30
    if transaction.location and "suspicious" in transaction.location.lower():
        risk_score += 40
    
    is_flagged = risk_score > 50
    
    db_transaction = models.Transaction(
        **transaction.dict(),
        risk_score=risk_score,
        is_flagged=is_flagged
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

# Stats endpoint
@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    total_transactions = db.query(models.Transaction).count()
    high_risk = db.query(models.Transaction).filter(models.Transaction.risk_score > 80).count()
    medium_risk = db.query(models.Transaction).filter(models.Transaction.risk_score > 50, models.Transaction.risk_score <= 80).count()
    low_risk = db.query(models.Transaction).filter(models.Transaction.risk_score <= 50).count()
    
    # Calculate average processing time (mock for now)
    avg_processing = 1.2
    
    return {
        "total_analyzed": total_transactions,
        "high_risk": high_risk,
        "medium_risk": medium_risk,
        "low_risk": low_risk,
        "avg_processing": avg_processing
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
