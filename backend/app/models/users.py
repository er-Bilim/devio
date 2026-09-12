import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import String

from .base import Base

if TYPE_CHECKING:
    from .progress import StageProgress
    from .user_badges import UserBadge


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, server_default=text("gen_random_uuid()")
    )
    email: Mapped[str] = mapped_column(unique=True, index=True)
    username: Mapped[str] = mapped_column(
        String(30), unique=True, index=True, nullable=False
    )
    display_name: Mapped[str] = mapped_column(
        String(25), unique=False, index=True, nullable=False
    )
    password_hash: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    progress: Mapped[list["StageProgress"]] = relationship(back_populates="user")
    role: Mapped[str] = mapped_column(server_default=text("'user'"))
    badges: Mapped[list["UserBadge"]] = relationship(back_populates="user")
