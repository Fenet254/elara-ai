import os
import frontmatter
import chromadb
from sentence_transformers import SentenceTransformer
from pathlib import Path
import pickle

DATA_DIR = "data/raw"
CHROMA_PATH = "data/processed/chroma_db"
BM25_PATH = "data/processed/bm25_index.pkl"

def load_documents():
    docs = []
    for root, _, files in os.walk(DATA_DIR):
        for fname in files:
            if not fname.endswith(".md"):
                continue
            path = Path(root) / fname
            post = frontmatter.load(path)
            content = post.content.strip()
            if not content:
                continue
            docs.append({
                "id": str(path.relative_to(DATA_DIR)).replace("\\", "/"),
                "text": content,
                "title": post.get("title", fname),
                "category": post.get("category", "general"),
                "tags": post.get("tags", []),
                "status": post.get("status", "unknown"),
            })
    return docs

def chunk_document(doc, max_chars=1200):
    sections = doc["text"].split("\n---\n")
    chunks = []
    buffer = ""
    for section in sections:
        if len(buffer) + len(section) < max_chars:
            buffer += "\n---\n" + section if buffer else section
        else:
            if buffer:
                chunks.append(buffer)
            buffer = section
    if buffer:
        chunks.append(buffer)
    return chunks

def build_index():
    print("Loading documents...")
    docs = load_documents()
    print(f"Found {len(docs)} documents")

    embedder = SentenceTransformer("all-MiniLM-L6-v2")
    client = chromadb.PersistentClient(path=CHROMA_PATH)
    collection = client.get_or_create_collection("elara_knowledge")

    all_chunks = []
    ids, texts, metadatas = [], [], []

    for doc in docs:
        chunks = chunk_document(doc)
        for i, chunk in enumerate(chunks):
            chunk_id = f"{doc['id']}::chunk{i}"
            ids.append(chunk_id)
            texts.append(chunk)
            metadatas.append({
                "source": doc["id"],
                "title": doc["title"],
                "category": doc["category"],
                "tags": ",".join(doc["tags"]) if isinstance(doc["tags"], list) else str(doc["tags"]),
                "status": doc["status"],
            })
            all_chunks.append(chunk)

    print(f"Embedding {len(texts)} chunks...")
    embeddings = embedder.encode(texts, show_progress_bar=True).tolist()

    print("Writing to ChromaDB...")
    collection.upsert(ids=ids, embeddings=embeddings, documents=texts, metadatas=metadatas)

    print("Building BM25 index...")
    from rank_bm25 import BM25Okapi
    tokenized = [t.lower().split() for t in all_chunks]
    bm25 = BM25Okapi(tokenized)

    os.makedirs("data/processed", exist_ok=True)
    with open(BM25_PATH, "wb") as f:
        pickle.dump({"bm25": bm25, "ids": ids, "texts": texts, "metadatas": metadatas}, f)

    print(f"Done. Indexed {len(texts)} chunks from {len(docs)} documents.")

if __name__ == "__main__":
    build_index()