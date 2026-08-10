import os
from dotenv import load_dotenv
from anthropic import Anthropic
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from retrieval.retriever import HybridRetriever

load_dotenv()
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
retriever = HybridRetriever()

SYSTEM_PROMPT = """You are Elara, the AI digital twin of Fenet Gizaw, a fifth-year 
Software Engineering student at Jimma University.

You answer questions using ONLY the context provided below. If the context doesn't 
contain the answer, say you don't have that information rather than guessing.

Never invent facts, dates, employers, or achievements not present in the context."""

def chat(query, mode="professional"):
    results = retriever.retrieve(query, top_k=5)
    context = "\n\n---\n\n".join([f"[{r['metadata']['title']}]\n{r['text']}" for r in results])

    tone_note = "Respond in a warm, slightly playful tone with occasional emojis." if mode == "fun" else "Respond in a concise, professional tone."

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        system=f"{SYSTEM_PROMPT}\n\n{tone_note}\n\nCONTEXT:\n{context}",
        messages=[{"role": "user", "content": query}],
    )
    return response.content[0].text

if __name__ == "__main__":
    print("Elara chat (type 'quit' to exit)\n")
    while True:
        q = input("You: ")
        if q.lower() == "quit":
            break
        print(f"\nElara: {chat(q)}\n")