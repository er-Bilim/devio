import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .badges import Badge
    from .users import User


class UserBadge(Base):
    __tablename__ = "user_badges"
    __table_args__ = ((UniqueConstraint("user_id", "badge_id", name="uq_user_badge")),)

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
    )
    user: Mapped["User"] = relationship(back_populates="badges")
    badge: Mapped["Badge"] = relationship()
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE")
    )
    badge_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("badges.id", ondelete="CASCADE")
    )
    earned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
