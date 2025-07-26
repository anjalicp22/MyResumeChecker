# ai-service\app\rag\prompt_templates.py
def skill_prompt(resume: str, jd_context: str) -> str:
    return f"""
You are an AI assistant helping improve a resume for a specific job.

Given the RESUME:
\"\"\"
{resume}
\"\"\"

And the JOB DESCRIPTION CONTEXT:
\"\"\"
{jd_context}
\"\"\"

List the TOP MISSING SKILLS that the candidate should add to their resume. Return as a plain list.
"""
