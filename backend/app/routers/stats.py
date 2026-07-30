from fastapi import APIRouter

from app.dependencies import DbSession
from app.queries import stats
from app.schemas import DirectionStat

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/directions", response_model=list[DirectionStat])
async def get_directions_popularity(db: DbSession):
    return await stats.directions_popularity(db)
