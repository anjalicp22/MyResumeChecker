# ai_service/app/services/skill_extraction.py
import os
import cohere
from dotenv import load_dotenv
import json
import re

load_dotenv()
co = cohere.Client(os.getenv("COHERE_API_KEY"))

def suggest_additional_skills_from_resume(resume_text: str, job_description: str = "") -> dict:
    prompt = f"""
You are an AI resume analysis assistant.

Given the following RESUME TEXT:
\"\"\"{resume_text}\"\"\"

{f"And the following JOB DESCRIPTION:\n\"\"\"{job_description}\"\"\"" if job_description else ""}

1. Extract all technical, soft, and professional skills mentioned in the resume.
2. Suggest 5 additional high-demand skills (technical or soft) that would strengthen the resume { "for the job described" if job_description else "" }.

Respond in this exact JSON format:
{{
  "existing_skills": ["skill1", "skill2", "..."],
  "suggested_skills": ["skill1", "skill2", "..."]
}}
"""

    try:
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
        result = json.loads(json_str)

        print("AI Skill Extraction Result:\n", result)
        return result

    except json.JSONDecodeError as e:
        print("Failed to parse JSON:\n", json_str)
        raise ValueError(f"Invalid JSON from AI response: {str(e)}")
    except Exception as e:
        print("Cohere API Error:", e)
        raise


# Optional test runner
if __name__ == "__main__":
    sample_resume = """
    Experienced Python Developer with expertise in Django, Flask, REST APIs, and PostgreSQL.
    Familiar with Git, Docker, and Agile methodologies.
    """

    sample_jd = """
    Looking for a QA Specialist with experience in manual testing, defect tracking, Jira, and basic knowledge of Postman and SDLC. Strong communication and analytical skills are required.
    """

    try:
        result = suggest_additional_skills_from_resume(sample_resume, sample_jd)
        print("\n🔍 Final Output:\n", result)
    except Exception as e:
        print("Error:", e)
