# ai_service\app\services\analyze_job_description.py
import os
import cohere
import re
from dotenv import load_dotenv

load_dotenv()
co = cohere.Client(os.getenv("COHERE_API_KEY"))

def extract_required_skills(jd_text: str) -> list:
    prompt = f"""
You are an AI assistant. Given the following JOB DESCRIPTION text:

\"\"\" {jd_text} \"\"\"

Extract all required technical and key professional skills, and output them as a comma-separated list.
"""
    resp = co.generate(
        model="command-r-plus",
        prompt=prompt,
        max_tokens=150,
        temperature=0.3
    )

    text = resp.generations[0].text.strip()
    # Split by comma or newline, trim
    parts = re.split(r"[,\n]", text)
    return [p.strip() for p in parts if p.strip()]
