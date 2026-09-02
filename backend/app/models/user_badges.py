import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class UserBadge(Base):
    __tablename__ = "user_badges"
    __table_args__ = ((UniqueConstraint("user_id", "badge_id", name="uq_user_badge")),)

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE")
    )
    badge_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("badges.id", ondelete="CASCADE")
    )
    earned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
