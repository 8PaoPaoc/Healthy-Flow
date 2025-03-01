from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.user import UserService
from ..schemas.user import UserCreate, UserUpdate, UserResponse
from typing import List

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """用户注册"""
    return await UserService.create_user(db, user)

@router.get("/me", response_model=UserResponse)
async def get_current_user(
    current_user: UserResponse = Depends(AuthService.get_current_user)
):
    """获取当前用户信息"""
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_user_info(
    user_update: UserUpdate,
    current_user: UserResponse = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """更新用户信息"""
    return await UserService.update_user(db, current_user.id, user_update)

@router.post("/verify/{verification_code}")
async def verify_email(verification_code: str, db: Session = Depends(get_db)):
    """验证用户邮箱"""
    return await UserService.verify_user(db, verification_code) 