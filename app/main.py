from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import users
from .database import init_db
import logging
from datetime import datetime

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("healthyflow")

# 创建FastAPI应用
app = FastAPI(
    title="HealthyFlow API",
    description="健康管理系统API",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含路由
app.include_router(users.router)

# 启动事件
@app.on_event("startup")
async def startup_event():
    logger.info(f"Application startup at {datetime.utcnow()}")
    init_db()

# 根路由
@app.get("/")
async def root():
    return {
        "message": "Welcome to HealthyFlow API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

# 健康检查
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    } 