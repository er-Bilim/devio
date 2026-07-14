from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.dependencies import AdminUser, DbSession, pagination
from app.models import Roadmap
from app.shemas import RoadmapCreate, RoadmapOut

router = APIRouter(prefix="/roadmaps", tags=["roadmaps"])


@router.get("/", response_model=list[RoadmapOut])
async def list_roadmaps(
    db: DbSession, direction: str | None = None, pg: dict = Depends(pagination)
):
    result = await db.execute(select(Roadmap).options(selectinload(Roadmap.stages)))

    return result.scalars().all()


@router.get("/{slug}", response_model=RoadmapOut)
async def get_roadmap(slug: str, db: DbSession):
    result = await db.execute(
        select(Roadmap)
        .where(Roadmap.slug == slug)
        .options(selectinload(Roadmap.stages))
    )

    roadmap = result.scalar_one_or_none()
    if roadmap is None:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return roadmap


@router.post("/", response_model=RoadmapOut, status_code=201)
async def create_stage(data: RoadmapCreate, db: DbSession):
    roadmap = Roadmap(slug=data.slug, title=data.title, description=data.description)
    db.add(roadmap)
    await db.commit()
    await db.refresh(roadmap)
    return roadmap


@router.delete("/{slug}")
def delete_roadmap(slug: str, admin: AdminUser):
    return {"deleted": slug}
