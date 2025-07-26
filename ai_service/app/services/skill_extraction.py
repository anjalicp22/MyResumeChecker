# ai_service\app\services\skill_extraction.py
import os
import cohere
from dotenv import load_dotenv
import json
import re

load_dotenv()

co = cohere.Client(os.getenv("COHERE_API_KEY"))

def extract_skills_from_context(resume: str, jd_context: str) -> list:
    prompt = f"""
You are an AI assistant helping improve a resume for a specific job.

Given the RESUME:
\"\"\"{resume}\"\"\"

And the JOB DESCRIPTION CONTEXT:
\"\"\"{jd_context}\"\"\"

List the TOP MISSING SKILLS that the candidate should add to their resume. Return as a plain list, one skill per line.
"""
    response = co.generate(
        model="command-r-plus",
        prompt=prompt,
        max_tokens=300,
        temperature=0.5,
    )
    raw_text = response.generations[0].text.strip()
    return [line.strip("-• ") for line in raw_text.split("\n") if line.strip()]

# ai_service/app/services/skill_extraction.py

def suggest_additional_skills_from_resume(resume_text: str) -> dict:
    prompt = f"""
        You are an AI resume analysis assistant.

        Given the following RESUME TEXT:
        \"\"\"{resume_text}\"\"\"

        1. Extract all technical and professional skills mentioned in the resume.
        2. Suggest 5 additional high-demand software engineering skills that are missing but would strengthen the resume.

        Respond in this exact JSON format:
        {{
        "existing_skills": ["skill1", "skill2", "..."],
        "suggested_skills": ["skill1", "skill2", "..."]
        }}
        """

    response = co.generate(
        model="command-r-plus",
        prompt=prompt,
        max_tokens=300,
        temperature=0.5,
    )

    raw_text = response.generations[0].text.strip()

    match = re.search(r"\{[\s\S]*?\}", raw_text)
    if not match:
        print("JSON parse error from Cohere response:\n", raw_text)
        raise ValueError("No valid JSON object found in AI response.")

    json_str = match.group(0)

    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print("Cleaned JSON string:\n", json_str)
        raise ValueError(f"Invalid JSON from AI response: {str(e)}")

# Optional test runner
if __name__ == "__main__":
    sample_resume = """
    Experienced Python Developer with expertise in Django, Flask, REST APIs, and PostgreSQL.
    Familiar with Git, Docker, and Agile methodologies.
    """
    try:
        result = suggest_additional_skills_from_resume(sample_resume)
        print("AI Skill Analysis:\n", result)
    except Exception as e:
        print("Error:", e)
