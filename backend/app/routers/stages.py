from fastapi import APIRouter

from app.dependencies import DbSession
from app.queries import stages as stages_q
from app.schemas import StageOut

router = APIRouter(prefix="/stages", tags=["stages"])


@router.get("/", response_model=list[StageOut])
async def list_stages(db: DbSession):
    stages = await stages_q.all_stages(db)
    return stages


@router.get("/{id}", response_model=StageOut)
async def get_stage(db: DbSession, id: int):
    stage = await stages_q.single_stage(db, id)
    return stage
