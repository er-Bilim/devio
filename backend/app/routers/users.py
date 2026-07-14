from fastapi import APIRouter

from app.dependencies import CurrentUser, DbSession
from app.shemas import UserPublic

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserPublic)
def read_me(current_user: CurrentUser):
    return current_user
 

@router.get("/me/progress")
def my_progress(user=CurrentUser, db=DbSession):
    return user
