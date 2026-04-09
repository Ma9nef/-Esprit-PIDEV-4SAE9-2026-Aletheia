import asyncio
import socket
import logging
from contextlib import asynccontextmanager

import py_eureka_client.eureka_client as eureka_client
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.router import router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_local_ip() -> str:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ───────────────────────────────────────────────────────────────
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)

    logger.info("Registering with Eureka at %s", settings.eureka_url)
    await asyncio.to_thread(
        eureka_client.init,
        eureka_server=settings.eureka_url,
        app_name="NOTIFICATION",
        instance_host=get_local_ip(),
        instance_port=settings.server_port,
        instance_ip=get_local_ip(),
        health_check_url=f"http://{get_local_ip()}:{settings.server_port}/health",
        home_page_url=f"http://{get_local_ip()}:{settings.server_port}/",
    )
    logger.info("Notification service started on port %d", settings.server_port)

    yield

    # ── Shutdown ──────────────────────────────────────────────────────────────
    logger.info("Deregistering from Eureka...")
    await asyncio.to_thread(eureka_client.stop)
    logger.info("Notification service stopped.")


app = FastAPI(
    title="Notification Service",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
def health():
    return {"status": "UP", "service": "notification-service"}


@app.get("/")
def root():
    return {"service": "Notification Service", "version": "1.0.0"}
