from fastapi import APIRouter, Response

from app.dependencies import CurrentUser, DbSession
from app.queries import stages as stages_q
from app.schemas import ProgressOut, StageOut
from app.services import progress as progress_service

router = APIRouter(prefix="/stages", tags=["stages"])


@router.get("/", response_model=list[StageOut])
async def list_stages(db: DbSession):
    stages = await stages_q.all_stages(db)
    return stages


@router.get("/{id}", response_model=StageOut)
async def get_stage(db: DbSession, id: int):
    stage = await stages_q.get_by_id(db, id)
    return stage


@router.post("/{stage_id}/complete", response_model=ProgressOut)
async def complete_stage(
    stage_id: int, response: Response, db: DbSession, current_user: CurrentUser
):
    entry, created = await progress_service.complete_stage(db, current_user, stage_id)

    response.status_code = 201 if created else 200

    return entry

# @router.delete("/{stage_id}/complete", status_code=204)
