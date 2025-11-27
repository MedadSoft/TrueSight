from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    role: str = "analyst"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Case Schemas
class CaseBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    fraud_type: Optional[str] = None

class CaseCreate(CaseBase):
    pass

class Case(CaseBase):
    id: int
    case_number: str
    status: str
    assigned_to_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    closed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Alert Schemas
class AlertBase(BaseModel):
    alert_type: str
    severity: str = "medium"
    description: Optional[str] = None

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    id: int
    status: str
    case_id: Optional[int] = None
    created_by_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Transaction Schemas
class TransactionBase(BaseModel):
    transaction_id: str
    amount: float
    currency: str = "USD"
    transaction_type: Optional[str] = None
    merchant: Optional[str] = None
    location: Optional[str] = None
    ip_address: Optional[str] = None
    device_id: Optional[str] = None
    user_account: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    risk_score: float
    is_flagged: bool
    case_id: Optional[int] = None
    timestamp: datetime
    
    class Config:
        from_attributes = True

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
