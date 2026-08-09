from datetime import datetime, timedelta, timezone

import pytest
from sqlalchemy import func, select

from app.models import Roadmap, Stage, StageProgress


@pytest.fixture
async def seeded(db, auth_client):
    """Юзер + роадмап с тремя этапами, прямо в базу"""
    user = auth_client.cookies["user_id"]
    roadmap = Roadmap(slug="frontend", title="Frontend", description="...")
    db.add_all([roadmap])
    await db.flush()

    stages = [
        Stage(title=f"Stage {i}", position=str(i), roadmap_id=roadmap.id)
        for i in range(1, 4)
    ]

    db.add_all(stages)
    await db.commit()
    return user, roadmap, stages


async def test_complete_stage_is_idempotent(auth_client, db, seeded):
    _, _, stages = seeded
    stage_id = stages[0].id

    r1 = await auth_client.post(f"/stages/{stage_id}/complete")
    r2 = await auth_client.post(f"/stages/{stage_id}/complete")

    assert r1.status_code in (200, 201)
    assert r2.status_code in (200, 201)

    count = await db.scalar(select(func.count()).select_from(StageProgress))
    assert count == 1


# @pytest.mark.parametrize(
#     "days_ago, expected",
#     [([0, 1, 2], 3), ([1, 2], 2), ([2, 3], 0), ([0, 1, 3, 4], 2), ([], 0)],
# )
# async def test_current_streak(db, seeded, days_ago, expected):
#     user, _, stages = seeded
#     now = datetime.now(timezone.utc)

#     for d in days_ago:
#         db.add(
#             StageProgress(
#                 user_id=user.id,
#                 stage_id=stages[0].id if d == days_ago[0] else stages[1].id,
#                 completed_at=now - timedelta(days=d),
#             )
#         )
