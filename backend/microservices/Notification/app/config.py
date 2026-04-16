import os

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    server_port: int = 8083
    eureka_url: str = "http://localhost:8761/eureka"
    db_url: str = "mysql+pymysql://root:@localhost:3306/aletheia_notification?charset=utf8mb4"
    jwt_secret: str = "CHANGE_ME_CHANGE_ME_CHANGE_ME_123456"
    internal_secret: str = "LIBRARY_INTERNAL_SECRET_123"


settings = Settings()
