from datetime import datetime
from sqlalchemy import BigInteger, Boolean, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base
import enum


class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    INSTRUCTOR = "INSTRUCTOR"
    LEARNER = "LEARNER"


class NotificationType(str, enum.Enum):
    # Populated with real types once logic is defined
    INFO = "INFO"
    WARNING = "WARNING"
    SUCCESS = "SUCCESS"
    ERROR = "ERROR"


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    recipient_id: Mapped[int] = mapped_column(BigInteger, nullable=False, index=True)
    recipient_role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False)
    type: Mapped[NotificationType] = mapped_column(Enum(NotificationType), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    read_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
