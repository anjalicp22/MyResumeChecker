# ai_service\app\services\embedding.py
import os
import cohere
from dotenv import load_dotenv

load_dotenv()

co = cohere.Client(os.getenv("COHERE_API_KEY"))

def get_embedding(text: str, model: str = "embed-english-v3.0") -> list:
    response = co.embed(
        texts=[text],
        model=model,
        input_type="search_document"  # Required for v3 embeddings
    )
    return response.embeddings[0]