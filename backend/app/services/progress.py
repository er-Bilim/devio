from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import StageProgress, User
from app.queries import progress as progress_q
from app.queries import stages as stages_q


async def complete_stage(
    db: AsyncSession, user: User, stage_id: int
) -> tuple[StageProgress, bool]:
    stage = await stages_q.get_by_id(db, stage_id)
    if stage is None:
        raise HTTPException(status_code=404, detail="Stage not found")

    existing = await progress_q.get_progress(db, user.id, stage.id)

    if existing is not None:
        return existing, False

    entry = StageProgress(user_id=user.id, stage_id=stage_id)
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry, True
