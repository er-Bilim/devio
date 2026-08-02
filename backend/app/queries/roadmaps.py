from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Roadmap
from app.schemas import RoadmapCreate


async def all_roadmaps(db: AsyncSession) -> Sequence[Roadmap]:
    stmt = select(Roadmap).options(selectinload(Roadmap.stages))

    result = await db.execute(stmt)
    return result.scalars().all()


async def get_by_id(db: AsyncSession, roadmap_id: int) -> Roadmap | None:
    stmt = (
        select(Roadmap)
        .where(Roadmap.id == roadmap_id)
        .options(selectinload(Roadmap.stages))
    )

    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_by_slug(db: AsyncSession, slug: str) -> Roadmap | None:
    stmt = (
        select(Roadmap)
        .where(Roadmap.slug == slug)
        .options(selectinload(Roadmap.stages))
    )

    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def add_roadmap(db: AsyncSession, data: RoadmapCreate):
    roadmap = Roadmap(slug=data.slug, title=data.title, description=data.description)
    db.add(roadmap)
    await db.commit()
    await db.refresh(roadmap)
    return roadmap


async def update_roadmap(db: AsyncSession, roadmap: Roadmap, fields: dict) -> Roadmap:
    for name, value in fields.items():
        setattr(roadmap, name, value)

    await db.commit()
    await db.refresh(roadmap, attribute_names=["stages"])
    return roadmap


async def delete_roadmap(db: AsyncSession, roadmap_id: int) -> bool:
    roadmap = await db.get(Roadmap, roadmap_id)

    if roadmap is None:
        return False

    await db.delete(roadmap)
    await db.commit()

    return True
