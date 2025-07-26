# ai-service\app\rag\retriever.py
import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from app.services.embedding import get_embedding

# Load environment variables
load_dotenv()

# Initialize Pinecone client
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Get index name and dimension
index_name = os.getenv("PINECONE_INDEX_NAME")
dimension = 1536  # Update if you're using a different embedding dimension

# Optionally create the index if it doesn't exist
if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=dimension,
        metric="cosine",  # Or "euclidean"
        spec=ServerlessSpec(
            cloud="aws",  # Or "gcp"
            region="us-east-1"  # Match your Pinecone project region
        )
    )

# Connect to the index
index = pc.Index(index_name)

# Retrieve relevant chunks
def retrieve_relevant_chunks(resume_embedding: list, jd_chunks: list) -> list:
    results = index.query(vector=resume_embedding, top_k=5, include_metadata=True)
    return [match["metadata"]["text"] for match in results["matches"]]
