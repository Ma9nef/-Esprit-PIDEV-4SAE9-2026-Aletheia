from datetime import datetime
from pydantic import BaseModel
from app.models import NotificationType, UserRole


class NotificationCreate(BaseModel):
    recipient_id: int
    recipient_role: UserRole
    type: NotificationType
    title: str
    message: str


class NotificationResponse(BaseModel):
    id: int
    recipient_id: int
    recipient_role: UserRole
    type: NotificationType
    title: str
    message: str
    is_read: bool
    created_at: datetime
    read_at: datetime | None

    model_config = {"from_attributes": True}


class UnreadCountResponse(BaseModel):
    count: int


class TokenData(BaseModel):
    sub: str | None = None
    id: int | None = None
    role: str | None = None
