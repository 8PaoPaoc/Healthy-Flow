from pydantic import BaseModel, EmailStr, validator
from typing import Optional, Dict, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    confirm_password: str
    
    @validator('username')
    def username_validator(cls, v):
        if len(v) < 3:
            raise ValueError('用户名长度必须大于3个字符')
        if not v.isalnum():
            raise ValueError('用户名只能包含字母和数字')
        return v
    
    @validator('password')
    def password_validator(cls, v):
        if len(v) < 8:
            raise ValueError('密码长度必须大于8个字符')
        if not any(char.isupper() for char in v):
            raise ValueError('密码必须包含至少一个大写字母')
        if not any(char.islower() for char in v):
            raise ValueError('密码必须包含至少一个小写字母')
        if not any(char.isdigit() for char in v):
            raise ValueError('密码必须包含至少一个数字')
        return v
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('两次输入的密码不匹配')
        return v

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    blood_type: Optional[str] = None
    allergies: Optional[List[str]] = None
    medical_conditions: Optional[List[str]] = None
    preferences: Optional[Dict] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    role: str
    created_at: datetime
    is_active: bool
    is_verified: bool
    
    class Config:
        from_attributes = True 