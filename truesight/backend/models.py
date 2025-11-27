from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default="analyst")  # analyst, investigator, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    cases = relationship("Case", back_populates="assigned_to")
    alerts = relationship("Alert", back_populates="created_by")

class Case(Base):
    __tablename__ = "cases"
    
    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="open")  # open, investigating, closed
    priority = Column(String, default="medium")  # low, medium, high, critical
    fraud_type = Column(String)  # identity_theft, payment_fraud, account_takeover, etc.
    assigned_to_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)
    
    assigned_to = relationship("User", back_populates="cases")
    alerts = relationship("Alert", back_populates="case")
    transactions = relationship("Transaction", back_populates="case")

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    alert_type = Column(String, nullable=False)  # suspicious_transaction, unusual_pattern, etc.
    severity = Column(String, default="medium")  # low, medium, high, critical
    description = Column(Text)
    status = Column(String, default="new")  # new, reviewing, escalated, dismissed
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=True)
    created_by_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    case = relationship("Case", back_populates="alerts")
    created_by = relationship("User", back_populates="alerts")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, index=True, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    transaction_type = Column(String)  # payment, transfer, withdrawal, etc.
    merchant = Column(String)
    location = Column(String)
    ip_address = Column(String)
    device_id = Column(String)
    user_account = Column(String)
    risk_score = Column(Float, default=0.0)  # 0-100
    is_flagged = Column(Boolean, default=False)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    case = relationship("Case", back_populates="transactions")
