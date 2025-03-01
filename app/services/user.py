from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate
from ..utils.security import get_password_hash, verify_password
from datetime import datetime
import uuid

class UserService:
    @staticmethod
    async def create_user(db: Session, user: UserCreate) -> User:
        """创建新用户"""
        # 检查用户名是否存在
        if db.query(User).filter(User.username == user.username).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="用户名已存在"
            )
        
        # 检查邮箱是否存在
        if db.query(User).filter(User.email == user.email).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="邮箱已被注册"
            )
        
        # 创建用户
        db_user = User(
            username=user.username,
            email=user.email,
            password_hash=get_password_hash(user.password),
            verification_code=str(uuid.uuid4())
        )
        
        try:
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            return db_user
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="创建用户失败"
            )

    @staticmethod
    async def update_user(db: Session, user_id: int, user_update: UserUpdate) -> User:
        """更新用户信息"""
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在"
            )
        
        # 更新用户信息
        update_data = user_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_user, key, value)
        
        try:
            db.commit()
            db.refresh(db_user)
            return db_user
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="更新用户信息失败"
            )

    @staticmethod
    async def verify_user(db: Session, verification_code: str) -> User:
        """验证用户邮箱"""
        db_user = db.query(User).filter(User.verification_code == verification_code).first()
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="验证码无效"
            )
        
        db_user.is_verified = True
        db_user.verification_code = None
        db.commit()
        return db_user 