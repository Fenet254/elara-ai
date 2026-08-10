import chromadb
import pickle
from sentence_transformers import SentenceTransformer, CrossEncoder

CHROMA_PATH = "data/processed/chroma_db"
BM25_PATH = "data/processed/bm25_index.pkl"

class HybridRetriever:
    def __init__(self):
        self.embedder = SentenceTransformer("all-MiniLM-L6-v2")
        self.reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
        client = chromadb.PersistentClient(path=CHROMA_PATH)
        self.collection = client.get_collection("elara_knowledge")
        with open(BM25_PATH, "rb") as f:
            data = pickle.load(f)
        self.bm25 = data["bm25"]
        self.bm25_ids = data["ids"]
        self.bm25_texts = data["texts"]
        self.bm25_metadatas = data["metadatas"]

    def vector_search(self, query, top_k=10):
        emb = self.embedder.encode([query]).tolist()
        results = self.collection.query(query_embeddings=emb, n_results=top_k)
        return [
            {"id": results["ids"][0][i], "text": results["documents"][0][i], "metadata": results["metadatas"][0][i]}
            for i in range(len(results["ids"][0]))
        ]

    def bm25_search(self, query, top_k=10):
        tokenized_query = query.lower().split()
        scores = self.bm25.get_scores(tokenized_query)
        top_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:top_k]
        return [
            {"id": self.bm25_ids[i], "text": self.bm25_texts[i], "metadata": self.bm25_metadatas[i]}
            for i in top_indices
        ]

    def retrieve(self, query, top_k=5, category_filter=None):
        vector_results = self.vector_search(query, top_k=15)
        bm25_results = self.bm25_search(query, top_k=15)

        merged = {}
        for r in vector_results + bm25_results:
            merged[r["id"]] = r

        candidates = list(merged.values())
        if category_filter:
            candidates = [c for c in candidates if c["metadata"].get("category") == category_filter]

        if not candidates:
            return []

        pairs = [(query, c["text"]) for c in candidates]
        scores = self.reranker.predict(pairs)
        ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)

        return [c for c, s in ranked[:top_k]]


if __name__ == "__main__":
    retriever = HybridRetriever()
    results = retriever.retrieve("Tell me about the weapon detection internship")
    for r in results:
        print(f"[{r['metadata']['title']}] {r['text'][:150]}...\n")