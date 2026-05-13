from datetime import datetime
from sqlalchemy.orm import Session
from app.models import Notification, UserRole
from app.schemas import NotificationCreate


def create_notification(db: Session, data: NotificationCreate) -> Notification:
    notif = Notification(**data.model_dump())
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


def get_notifications_for_user(
    db: Session, user_id: int, skip: int = 0, limit: int = 50
) -> list[Notification]:
    return (
        db.query(Notification)
        .filter(Notification.recipient_id == user_id)
        .order_by(Notification.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_unread_count(db: Session, user_id: int) -> int:
    return (
        db.query(Notification)
        .filter(Notification.recipient_id == user_id, Notification.is_read == False)
        .count()
    )


def mark_as_read(db: Session, notification_id: int, user_id: int) -> Notification | None:
    notif = (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.recipient_id == user_id)
        .first()
    )
    if notif and not notif.is_read:
        notif.is_read = True
        notif.read_at = datetime.utcnow()
        db.commit()
        db.refresh(notif)
    return notif


def mark_all_as_read(db: Session, user_id: int) -> int:
    updated = (
        db.query(Notification)
        .filter(Notification.recipient_id == user_id, Notification.is_read == False)
        .all()
    )
    now = datetime.utcnow()
    for notif in updated:
        notif.is_read = True
        notif.read_at = now
    db.commit()
    return len(updated)


def delete_notification(db: Session, notification_id: int, user_id: int) -> bool:
    notif = (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.recipient_id == user_id)
        .first()
    )
    if notif:
        db.delete(notif)
        db.commit()
        return True
    return False


def get_all_notifications(db: Session, skip: int = 0, limit: int = 100) -> list[Notification]:
    return (
        db.query(Notification)
        .order_by(Notification.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def broadcast_to_role(db: Session, role: UserRole, data: NotificationCreate) -> list[Notification]:
    """Send the same notification to all users of a given role (IDs resolved externally)."""
    notif = Notification(**data.model_dump())
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return [notif]
