from datetime import datetime, timedelta, timezone

import pytest
from sqlalchemy import func, select

from app.models import Roadmap, Stage, StageProgress


@pytest.fixture
async def seeded(db, auth_client):
    """Авторизованный юзер + роадмап с пятью этапами, прямо в базу"""
    resp = await auth_client.get("/users/me")
    user = resp.json()
    roadmap = Roadmap(slug="frontend", title="Frontend", description="...")
    db.add_all([roadmap])
    await db.flush()

    stages = [
        Stage(title=f"Stage {i}", position=i, roadmap_id=roadmap.id)
        for i in range(1, 6)
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


@pytest.mark.parametrize(
    "days_ago, expected",
    [
        ([0, 1, 2], 3),
        ([1, 2], 2),
        ([2, 3], 0),
        ([0, 1, 3, 4], 2),
        ([], 0),
    ],
)
async def test_current_streak(db, seeded, auth_client, days_ago, expected):
    user, _, stages = seeded
    now = datetime.now(timezone.utc)

    for index, d in enumerate(days_ago):
        db.add(
            StageProgress(
                user_id=user["id"],
                stage_id=stages[index].id,
                completed_at=now - timedelta(days=d),
            )
        )
    await db.commit()
    resp = await auth_client.get("/users/me/streak")
    assert resp.status_code == 200
    assert resp.json()["current"] == expected


async def test_complete_nonexistent_stage_404(auth_client, seeded):
    _, _, stages = seeded
    resp = await auth_client.post(f"/stages/{stages[-1].id + 1000}/complete")

    assert resp.status_code == 404


async def test_admin_forbidden_for_user(auth_client):
    data = {"slug": "ios", "title": "mobile ios", "description": "mobile ios developer"}
    resp = await auth_client.post("/roadmaps/", json=data)
    assert resp.status_code == 403


@pytest.mark.parametrize(
    "days_ago, expected", [([5, 4, 3, 1, 0], 3), ([0], 1), ([], 0)]
)
async def test_longest_streak_survives_gap(
    auth_client, days_ago, expected, db, seeded
):
    user, _, stages = seeded
    now = datetime.now(timezone.utc)

    for index, d in enumerate(days_ago):
        db.add(
            StageProgress(
                user_id=user["id"],
                stage_id=stages[index].id,
                completed_at=now - timedelta(days=d),
            )
        )
    await db.commit()
    resp = await auth_client.get("/users/me/streak")
    assert resp.status_code == 200
    assert resp.json()["longest"] == expected
