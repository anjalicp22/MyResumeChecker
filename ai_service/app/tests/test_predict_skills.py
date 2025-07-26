# tests/test_predict_skills.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_predict_skills():
    payload = {
        "resume_text": "Experienced in Python, Flask, and REST APIs",
        "job_description": "Looking for a developer skilled in Python, Flask, Docker, and PostgreSQL"
    }
    response = client.post("/predict-skills", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert "suggested_skills" in json_data
    assert isinstance(json_data["suggested_skills"], list)