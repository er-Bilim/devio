import enum
import uuid

from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class BadgeTier(str, enum.Enum):
    common = "common"
    rare = "rare"
    epic = "epic"
    legend = "legend"


class Badge(Base):
    __tablename__ = "badges"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(unique=True, index=True)
    title: Mapped[str]
    description: Mapped[str]
    condition: Mapped[str]
    tier: Mapped[BadgeTier]
    icon: Mapped[str]
    sort_order: Mapped[int]
    is_active: Mapped[bool]
