from sqlalchemy.dialects.postgresql import insert

from app.models import UserBadge
from app.queries.badges import get_badge_by_code


async def award(db, user_id, code: str) -> bool:
    badge = await get_badge_by_code(db, code)
    if not badge:
        return False
    stmt = (
        insert(UserBadge)
        .values(user_id=user_id, badge_id=badge.id)
        .on_conflict_do_nothing(constraint="uq_user_badge")
    )

    result = await db.execute(stmt)
    await db.commit()
    return result.rowcount > 0
