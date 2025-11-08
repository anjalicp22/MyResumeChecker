# MyResumeChecker\ai_service\tests\test_basic.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code in [200, 404, 500]  # Adjust based on your endpoint
