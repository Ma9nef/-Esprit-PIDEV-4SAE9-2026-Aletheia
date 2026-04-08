from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.schemas import NotificationCreate, NotificationResponse, UnreadCountResponse, TokenData
from app.security import get_current_user, require_admin
import app.service as service

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


# ── User endpoints (any authenticated role) ───────────────────────────────────

@router.get("/mine", response_model=list[NotificationResponse])
def get_my_notifications(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    """Get all notifications for the authenticated user."""
    return service.get_notifications_for_user(db, current_user.id, skip, limit)


@router.get("/mine/unread-count", response_model=UnreadCountResponse)
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    """Get the number of unread notifications for the authenticated user."""
    count = service.get_unread_count(db, current_user.id)
    return UnreadCountResponse(count=count)


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    """Mark a single notification as read."""
    notif = service.mark_as_read(db, notification_id, current_user.id)
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return notif


@router.patch("/mine/read-all")
def mark_all_as_read(
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    """Mark all notifications as read for the authenticated user."""
    updated = service.mark_all_as_read(db, current_user.id)
    return {"updated": updated}


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    """Delete one of the authenticated user's notifications."""
    if not service.delete_notification(db, notification_id, current_user.id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")


# ── Internal service-to-service endpoint ─────────────────────────────────────

@router.post("/internal/send", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def internal_send_notification(
    data: NotificationCreate,
    db: Session = Depends(get_db),
    x_internal_secret: str | None = Header(default=None),
):
    """Internal: called by other microservices (e.g. Library) to send notifications.
    Protected by X-Internal-Secret header instead of JWT."""
    if x_internal_secret != settings.internal_secret:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid internal secret")
    return service.create_notification(db, data)


# ── Admin endpoints ───────────────────────────────────────────────────────────

@router.get("/admin/all", response_model=list[NotificationResponse])
def get_all_notifications(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _: TokenData = Depends(require_admin),
):
    """Admin: list all notifications across all users."""
    return service.get_all_notifications(db, skip, limit)


@router.post("/admin/send", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def send_notification(
    data: NotificationCreate,
    db: Session = Depends(get_db),
    _: TokenData = Depends(require_admin),
):
    """Admin: send a notification to a specific user."""
    return service.create_notification(db, data)
