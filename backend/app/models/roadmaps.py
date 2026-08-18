from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(unique=True, index=True)
    title: Mapped[str]
    description: Mapped[str | None]

    stages: Mapped[list["Stage"]] = relationship(
        back_populates="roadmap", order_by="Stage.position"
    )


class Stage(Base):
    __tablename__ = "stages"

    id: Mapped[int] = mapped_column(primary_key=True)
    roadmap_id: Mapped[int] = mapped_column(ForeignKey("roadmaps.id"))
    title: Mapped[str]
    position: Mapped[int]
    description: Mapped[str | None]

    roadmap: Mapped["Roadmap"] = relationship(back_populates="stages")
