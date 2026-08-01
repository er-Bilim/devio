from fastapi import APIRouter

from app.dependencies import CurrentUser, DbSession
from app.queries import stats
from app.schemas import StreakOut, UserPublic

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserPublic)
def read_me(current_user: CurrentUser):
    return current_user


@router.get("/me/progress")
def my_progress(user=CurrentUser, db=DbSession):
    return user


@router.get("/me/streak", response_model=StreakOut)
async def my_streak(current_user: CurrentUser, db: DbSession):
    return StreakOut(
        current=await stats.current_streak(db, current_user.id),
        longest=await stats.longest_streak(db, current_user.id),
    )
