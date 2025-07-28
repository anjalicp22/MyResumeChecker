# ai_service\app\services\analyze_job_description.py
import os
import cohere
import re
from dotenv import load_dotenv

load_dotenv()
co = cohere.Client(os.getenv("COHERE_API_KEY"))

def extract_required_skills(jd_text: str) -> list:
    prompt = f"""
You are an AI recruiter.

Given this job description:

\"\"\"{jd_text}\"\"\"

Extract only the most relevant SKILLS required for this role. Give accurate skills. Return them as a comma-separated list.
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
