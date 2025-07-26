# app/tests/test_resume_file_analysis.py
import os
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_resume_file_upload():
    # Path to resume file inside the tests folder
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, "1750508577346-Fake_Software_Engineer_Resume_Ananya_Sharma.pdf")

    assert os.path.exists(file_path), f"Resume file not found: {file_path}"

    # POST the resume file to the endpoint
    with open(file_path, "rb") as f:
        response = client.post(
            "/analyze-resume-file",
            files={"file": ("resume.pdf", f, "application/pdf")}
        )

    # Check response structure
    assert response.status_code == 200
    data = response.json()
    assert "existing_skills" in data
    assert "suggested_skills" in data
    assert isinstance(data["existing_skills"], list)
    assert isinstance(data["suggested_skills"], list)
