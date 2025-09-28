import os
import cohere
import json
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

load_dotenv()
# co = cohere.Client(os.getenv("COHERE_API_KEY"))
co = cohere.ClientV2(api_key=os.getenv("COHERE_API_KEY"))

router = APIRouter()

class JDInput(BaseModel):
    job_description: str

class SkillOutput(BaseModel):
    required_skills: List[str]

def normalize_skill(skill: str) -> str:
    return skill.lower().strip()

@router.post("/analyze_job_description", response_model=SkillOutput)
async def extract_required_skills(input: JDInput):
    try:
        jd_text = input.job_description

        prompt = f"""
Given the following job description:
\"\"\"{jd_text}\"\"\"

Extract a list of technical and soft skills required for this job.
Do NOT infer unrelated skills. Just extract what's explicitly mentioned.

Respond ONLY as a valid JSON object like:
{{ "required_skills": ["skill1", "skill2", "skill3"] }}
"""


        # resp = co.generate(
        #     model="command-r-plus",
        #     prompt=prompt,
        #     max_tokens=200,
        #     temperature=0.3
        # )

        # text = resp.generations[0].text.strip()
        resp = co.chat(
            model="command-r-plus-08-2024",   
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"}  
        )

        text = resp.message.content[0].text.strip()
        skills = json.loads(text)
        if isinstance(skills, dict):
            skills = skills.get("required_skills") or skills.get("skills") or []

        if not isinstance(skills, list):
            skills = []

        # Normalize, deduplicate, and sort
        normalized_skills = sorted(list({normalize_skill(s) for s in skills if isinstance(s, str)}))

        return {"required_skills": normalized_skills}
    except Exception as e:
        print("Failed to parse skills:", e)
        return {"required_skills": []}
    except json.JSONDecodeError:
            skills = []

