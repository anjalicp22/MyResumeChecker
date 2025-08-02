import os
import cohere
import json
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

load_dotenv()
co = cohere.Client(os.getenv("COHERE_API_KEY"))

router = APIRouter()

class JDInput(BaseModel):
    job_description: str

class SkillOutput(BaseModel):
    required_skills: List[str]

@router.post("/analyze_job_description", response_model=SkillOutput)
async def extract_required_skills(input: JDInput):
    jd_text = input.job_description

    prompt = f"""
Given the following job description:
\"\"\"{jd_text}\"\"\"

Extract a list of technical and soft skills required for this job. 
Do NOT infer unrelated skills. Just extract what's explicitly mentioned.

Respond ONLY as a valid JSON list like:
["skill1", "skill2", "skill3"]
"""

    resp = co.generate(
        model="command-r-plus",
        prompt=prompt,
        max_tokens=200,
        temperature=0.3
    )

    text = resp.generations[0].text.strip()

    try:
        skills = json.loads(text)
        if isinstance(skills, list) and all(isinstance(s, str) for s in skills):
            return {"required_skills": [s.strip() for s in skills]}
        else:
            raise ValueError("Parsed data is not a valid list of strings")
    except Exception as e:
        print("❌ Failed to parse skills:", e)
        return {"required_skills": []}
