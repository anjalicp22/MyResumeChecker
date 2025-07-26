# tests/test_skill_extraction.py
# import pytest
# import sys
# import os
# sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from app.services.skill_extraction import suggest_additional_skills_from_resume

def test_suggest_additional_skills_from_resume():
    resume_text = """
    Python developer with experience in Django, Flask, and RESTful APIs.
    Familiar with Git, Docker, and Agile methodologies.
    """
    result = suggest_additional_skills_from_resume(resume_text)

    assert "existing_skills" in result
    assert "suggested_skills" in result
    assert isinstance(result["existing_skills"], list)
    assert isinstance(result["suggested_skills"], list)
    assert len(result["suggested_skills"]) <= 5
