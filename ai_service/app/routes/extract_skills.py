# ai_service\app\routes\extract_skills.py
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

# Canonical skill bank (already lowercased and stripped)
skill_bank = [s.lower().replace('.js', '') for s in [
    "Python", "React", "React.js", "Node.js", "MongoDB", 
    "SQL", "FastAPI", "AWS", "Docker", "TypeScript", 
    "HTML", "CSS", "Git", "Postman", "Express.js"
]]

class JDInput(BaseModel):
    job_description: str

@router.post("/extract-skills")
async def extract_skills(data: JDInput):
    jd = data.job_description.lower()

    # Extract skills from JD that match our bank (case-insensitive)
    required_skills = [skill for skill in skill_bank if skill in jd]

    return {"required_skills": list(set(required_skills))}
