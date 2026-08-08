from httpx import AsyncClient

from app.tests.constants import TEST_USER


async def test_register_creates_user(client: AsyncClient):
    resp = await client.post(
        "/auth/register", json={"email": "new@gmail.com", "password": "secret123"}
    )
    assert resp.status_code == 201
    body = resp.json()
    assert body["email"] == "new@gmail.com"
    assert "password" not in body
    assert "password_hash" not in body


async def test_me_requires_auth(client: AsyncClient):
    resp = await client.get("/users/me")
    assert resp.status_code == 401


async def test_register_duplicate_email_conflict(registered_client: AsyncClient):
    resp = await registered_client.post("/auth/register", json=TEST_USER)
    assert resp.status_code == 409


async def test_login_sets_cookies(registered_client: AsyncClient):
    resp = await registered_client.post("/auth/login", json=TEST_USER)

    assert resp.status_code == 200
    assert "access_token" in resp.cookies
    assert "refresh_token" in resp.cookies


async def test_login_wrong_password(registered_client: AsyncClient):
    resp = await registered_client.post(
        "/auth/login", json={**TEST_USER, "password": "WRONG"}
    )

    assert resp.status_code == 401
    assert "access_token" not in resp.cookies


async def test_me_returns_current_user(auth_client: AsyncClient):
    resp = await auth_client.get("/users/me")

    assert resp.status_code == 200
    assert resp.json()["email"] == TEST_USER["email"]


async def test_refresh_rotates_token(auth_client: AsyncClient):
    old_refresh = auth_client.cookies.get("refresh_token")

    resp = await auth_client.post("/auth/refresh")

    assert resp.status_code == 200
    assert auth_client.cookies.get("refresh_token") != old_refresh


async def test_old_refresh_is_revoked_after_rotation(auth_client: AsyncClient):
    old_refresh = auth_client.cookies["refresh_token"]
    await auth_client.post("/auth/refresh")

    auth_client.cookies.set("refresh_token", old_refresh)
    resp = await auth_client.post("/auth/refresh")

    assert resp.status_code == 401


async def test_logout_kills_session(auth_client: AsyncClient):
    resp = await auth_client.post("/auth/logout")
    assert resp.status_code == 204

    resp = await auth_client.get("/users/me")
    assert resp.status_code == 401
