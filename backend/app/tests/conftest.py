import os

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from app.db import Base, get_db
from app.main import app
from app.tests.constants import TEST_USER

TEST_DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql+asyncpg://devio:devio@localhost:5432/devio_test"
)

engine = create_async_engine(TEST_DATABASE_URL, poolclass=NullPool)
TestSession = async_sessionmaker(engine, expire_on_commit=False)


@pytest.fixture(scope="session", autouse=True)
async def prepare_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


@pytest.fixture
async def db():
    async with engine.connect() as conn:
        trans = await conn.begin()
        session = TestSession(bind=conn, join_transaction_mode="create_savepoint")
        yield session
        await session.close()
        await trans.rollback()


@pytest.fixture
async def client(db):
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="https://testserver") as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
async def registered_client(client: AsyncClient):
    """Юзер зарегистрирован, но не авторизован (кук нет)"""
    response = await client.post("/auth/register", json=TEST_USER)
    response.raise_for_status()
    return client


@pytest.fixture
async def auth_client(registered_client: AsyncClient):
    """Юзер зарегистрирован и авторизован (куки в кукоджаре)"""
    response = await registered_client.post("/auth/login", json=TEST_USER)
    response.raise_for_status()
    return registered_client
