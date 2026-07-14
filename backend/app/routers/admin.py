from fastapi import APIRouter, Depends

from app.dependencies import get_current_admin

router = APIRouter(
    prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin)]
)


@router.get("/stats")
def stats():
    return {"stats": "Стата"}
