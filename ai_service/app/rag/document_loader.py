#ai-service\app\rag\document_loader.py
def chunk_text(text: str, max_words: int = 100) -> list:
    words = text.split()
    chunks = [' '.join(words[i:i+max_words]) for i in range(0, len(words), max_words)]
    return chunks
