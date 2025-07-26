# ai_service\app\services\generate_skills.py
import os
import cohere
import json
import re
from .embedding import get_embedding
from ..rag.document_loader import chunk_text
from ..rag.retriever import retrieve_relevant_chunks
from ..rag.prompt_templates import skill_prompt
from dotenv import load_dotenv

load_dotenv()
co = cohere.Client(os.getenv("COHERE_API_KEY"))

def generate_skill_suggestions(resume_text: str, job_description: str) -> list:
    jd_chunks = chunk_text(job_description)
    resume_emb = get_embedding(resume_text)
    context = "\n".join(retrieve_relevant_chunks(resume_emb, jd_chunks))
    prompt = skill_prompt(resume_text, context)

    resp = co.generate(
        model="command-r-plus",
        prompt=prompt,
        max_tokens=200,
        temperature=0.5
    )

    lines = resp.generations[0].text.strip().splitlines()
    return [line.strip("-• ") for line in lines if line.strip()]
