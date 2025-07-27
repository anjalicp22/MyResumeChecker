# ai_service/app/utils/skill_match.py

import os
from typing import List, Tuple
import cohere
import numpy as np

# You can override the model via env var if you want
COHERE_MODEL = os.getenv("COHERE_EMBED_MODEL", "embed-english-v3.0")

_api_key = os.getenv("COHERE_API_KEY")
if not _api_key:
    raise RuntimeError("COHERE_API_KEY is not set")

co = cohere.Client(_api_key)

def _embed(texts: List[str]) -> np.ndarray:
    """
    Returns a (n, d) float32 numpy array of embeddings.
    """
    resp = co.embed(texts=texts, model=COHERE_MODEL, input_type="search_document")
    return np.asarray(resp.embeddings, dtype=np.float32)

def _cosine_sim_matrix(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    """
    Cosine similarity between every row in a and every row in b.
    """
    a_norm = a / (np.linalg.norm(a, axis=1, keepdims=True) + 1e-9)
    b_norm = b / (np.linalg.norm(b, axis=1, keepdims=True) + 1e-9)
    return a_norm @ b_norm.T

def semantic_match_skills(
    required_skills: List[str],
    resume_skills: List[str],
    threshold: float = 0.7
) -> Tuple[List[str], List[str]]:
    """
    Semantic match using Cohere embeddings. Returns (matched, missing).
    """
    if not required_skills or not resume_skills:
        return [], list(required_skills)

    req_emb = _embed(required_skills)
    res_emb = _embed(resume_skills)

    sims = _cosine_sim_matrix(req_emb, res_emb)  # shape: [len(required), len(resume)]

    matched, missing = [], []
    for i, row in enumerate(sims):
        if float(row.max()) >= threshold:
            matched.append(required_skills[i])
        else:
            missing.append(required_skills[i])

    # Ensure pure Python lists for safe JSON serialization
    return matched, missing
