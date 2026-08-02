from fastapi import APIRouter, HTTPException

from app.dependencies import AdminUser, DbSession
from app.queries import roadmaps as roadmaps_q
from app.schemas import RoadmapCreate, RoadmapOut, RoadmapUpdate

router = APIRouter(prefix="/roadmaps", tags=["roadmaps"])


@router.get("/", response_model=list[RoadmapOut])
async def list_roadmaps(db: DbSession):
    roadmaps = await roadmaps_q.all_roadmaps(db)

    return roadmaps


@router.get("/{roadmap_id}", response_model=RoadmapOut)
async def get_roadmap(roadmap_id: int, db: DbSession):

    roadmap = await roadmaps_q.get_by_id(db, roadmap_id)
    if roadmap is None:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return roadmap


@router.post("/", response_model=RoadmapCreate, status_code=201)
async def create_roadmap(data: RoadmapCreate, db: DbSession, _admin: AdminUser):
    roadmap = await roadmaps_q.add_roadmap(db, data)
    return roadmap


@router.patch("/{roadmap_id}", response_model=RoadmapOut)
async def update_roadmap(roadmap_id: int, data: RoadmapUpdate, db: DbSession):
    roadmap = await roadmaps_q.get_by_id(db, roadmap_id)
    if roadmap is None:
        raise HTTPException(status_code=404, detail="Roadmap not found")

    fields = data.model_dump(exclude_unset=True)

    if "slug" in fields:
        existings = await roadmaps_q.get_by_slug(db, fields["slug"])

        if existings is not None and existings.id != roadmap.id:
            raise HTTPException(status_code=400, detail="Slug already taken")

    if not fields:
        return roadmap

    return await roadmaps_q.update_roadmap(db, roadmap, fields)


@router.delete("/{roadmap_id}")
async def delete_roadmap(roadmap_id: int, db: DbSession, _admin: AdminUser):
    isDelete = await roadmaps_q.delete_roadmap(db, roadmap_id)

    if not isDelete:
        raise HTTPException(status_code=404, detail="Roadmap not found")

    return {"message": "Roadmap deleted successfully"}
