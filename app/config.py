from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # 基本配置
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    PROJECT_NAME: str = "HealthyFlow"
    VERSION: str = "1.0.0"
    
    # 数据库配置
    DATABASE_URL: str = "sqlite:///./healthyflow.db"
    
    # JWT配置
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings() 