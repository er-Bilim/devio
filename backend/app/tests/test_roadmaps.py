from fastapi.testclient import TestClient
from app.main import app
from app.db import get_db
from app.dependencies import get_current_user
from app import fake_users_db

def get_test_db()
  return "test"

app.dependency_overrides[get_db] = get_test_db
app.dependency_overrides[get_current_user] = lambda: fake_users_db

client = TestClient(app)

def test_my_progress():
  resp = client.get("/user/me/progress")
  assert resp.status_code == 200
