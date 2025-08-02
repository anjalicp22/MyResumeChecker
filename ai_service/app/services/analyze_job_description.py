# ai_service\app\services\analyze_job_description.py
import os
import cohere
import re
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel

load_dotenv()
co = cohere.Client(os.getenv("COHERE_API_KEY"))

router = APIRouter()

class JDInput(BaseModel):
    job_description: str

@router.post("/analyze_job_description")
async def extract_required_skills(jd_text: str) -> list:
    prompt = f"""
    Given the following job description:
    \"\"\"{jd_text}\"\"\"

    Extract a list of technical and soft skills required for this job. Do NOT infer unrelated skills. Just extract what's asked.

    Respond as:
    ["skill1", "skill2", ...]
    """
    resp = co.generate(
        model="command-r-plus",
        prompt=prompt,
        max_tokens=200,
        temperature=0.3
    )

    text = resp.generations[0].text.strip()
    skills = re.split(r"[,\n]", text)
    return [s.strip() for s in skills if s.strip()]
