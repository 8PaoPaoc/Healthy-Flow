from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON, Float
from sqlalchemy.orm import relationship
from ..database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String(255))
    
    # 用户基本信息
    first_name = Column(String(50))
    last_name = Column(String(50))
    phone = Column(String(20))
    date_of_birth = Column(DateTime)
    gender = Column(String(10))
    
    # 健康基础信息
    height = Column(Float)  # 身高(cm)
    weight = Column(Float)  # 体重(kg)
    blood_type = Column(String(5))
    allergies = Column(JSON, default=list)
    medical_conditions = Column(JSON, default=list)
    
    # 系统信息
    role = Column(String(20), default="user")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    last_login = Column(DateTime)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    verification_code = Column(String(32))
    
    # 用户设置
    preferences = Column(JSON, default={
        "theme": "light",
        "language": "zh-CN",
        "notifications": {
            "email": True,
            "push": True
        },
        "privacy": {
            "share_health_data": False,
            "share_exercise_data": False
        }
    }) 