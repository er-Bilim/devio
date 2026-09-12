from fastapi import APIRouter

from app.dependencies import DbSession
from app.queries import badges as badges_q
from app.schemas.badges import BadgeOut

router = APIRouter(prefix="/badges", tags=["badges"])


@router.get("/", response_model=list[BadgeOut])
async def list_badges(db: DbSession):
    badges = await badges_q.get_all_badges(db)
    return badges
