import os
import re
import sys
import time
import uuid
from pathlib import Path
from typing import List, Optional, TypedDict

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from generation.chat import answer
from generation.cv_generator import generate_cv

CV_DIR = Path(__file__).resolve().parents[2] / "data" / "generated_cvs"
CV_DIR.mkdir(parents=True, exist_ok=True)

AREA_PATTERNS = {
    "frontend": r"\b(front[\s-]?end|ui|ux|react|vue)\b",
    "backend": r"\b(back[\s-]?end|apis?|server[\s-]?side|node(?:\.?js)?|express)\b",
    "fullstack": r"\bfull[\s-]?stack\b",
    "ai_ml": r"\b(ai|ml|machine learning|deep learning|data scien\w+|computer vision|nlp)\b",
}
WHOLE_PATTERN = r"\b(whole|complete|entire|overall|everything|all of it)\b"
CV_PATTERN = r"\b(cv|resume|résumé|curriculum vitae)\b"
NOT_COMPANY = re.compile(
    r"\b(front[\s-]?end|back[\s-]?end|full[\s-]?stack|ai|ml|cv|resume|role|roles|position|job|team|me|you|her|him|us)\b",
    re.I,
)

LABELS = {"frontend": "Frontend", "backend": "Backend", "fullstack": "FullStack", "ai_ml": "AI-ML", "whole": "Complete"}
SPOKEN = {"frontend": "frontend", "backend": "backend", "fullstack": "full-stack", "ai_ml": "AI/ML"}


class State(TypedDict, total=False):
    query: str
    mode: str
    intent: str
    area: Optional[str]
    company: Optional[str]
    awaiting_area: bool
    reply: str
    files: List[dict]
    options: List[str]
    history: List[list]


def detect_area(text):
    lowered = text.lower()
    if re.search(WHOLE_PATTERN, lowered):
        return "whole"
    found = [name for name, pattern in AREA_PATTERNS.items() if re.search(pattern, lowered)]
    if "fullstack" in found or len(found) > 1:
        return "fullstack"
    return found[0] if found else None


def detect_company(text):
    parts = re.split(r"\b(?:at|for|from|with)\b", text, flags=re.I)[1:]
    for part in parts:
        chunk = re.split(r"\s+(?:and|so|but|because|since|as)\s+|[,.!?;]", part)[0].strip()
        name = " ".join(chunk.split()[:4])
        if len(name) < 2 or NOT_COMPANY.search(name):
            continue
        return name.title() if name.islower() else name
    return None


def clean_old_files(max_age=86400):
    cutoff = time.time() - max_age
    for path in CV_DIR.glob("*.pdf"):
        if path.stat().st_mtime < cutoff:
            path.unlink(missing_ok=True)


def tone(state, plain, playful):
    return playful if state.get("mode") == "fun" else plain


def remember(state, reply):
    history = state.get("history", [])
    return (history + [["user", state["query"]], ["ai", reply]])[-12:]


def classify(state):
    query = state["query"]
    wants_cv = bool(re.search(CV_PATTERN, query, re.I))
    area = detect_area(query)
    if wants_cv and area:
        return {"intent": "make", "area": area, "company": detect_company(query) or state.get("company")}
    if wants_cv:
        return {"intent": "ask", "company": detect_company(query) or state.get("company")}
    if state.get("awaiting_area") and area:
        return {"intent": "make", "area": area}
    return {"intent": "chat", "awaiting_area": False}


def ask_area(state):
    reply = tone(
        state,
        "Fenet has worked across frontend, backend, full stack and AI/ML projects. Which area should her CV focus on? I can also send the complete CV with her whole journey.",
        "Fenet has range \U0001F604 frontend, backend, full stack and AI/ML. Which area should her CV focus on, or do you want the complete CV with her whole journey?",
    )
    return {
        "reply": reply,
        "options": ["Frontend", "Backend", "Full stack", "AI/ML", "Complete CV"],
        "awaiting_area": True,
        "history": remember(state, reply),
    }


def make_cv(state):
    area = state["area"]
    company = state.get("company")
    focus = "general" if area == "whole" else area
    token = uuid.uuid4().hex[:8]
    parts = ["Fenet_Gizaw_CV", LABELS[area], re.sub(r"[^A-Za-z0-9]", "", company or ""), token]
    filename = "_".join(part for part in parts if part) + ".pdf"
    generate_cv(str(CV_DIR / filename), role_focus=focus, company_name=company)
    clean_old_files()

    where = f" for {company}" if company else ""
    if area == "whole":
        plain = f"Here's Fenet's complete CV{where}, covering her whole journey across frontend, backend, full stack and AI/ML."
        playful = f"Here you go \U0001F389 Fenet's complete CV{where}, her whole journey in one file."
    else:
        plain = f"Here's Fenet's {SPOKEN[area]} CV{where}, with the projects, skills and certificates that fit that area."
        playful = f"Here you go \U0001F389 Fenet's {SPOKEN[area]} CV{where}, trimmed to what matters for that role."
    reply = tone(state, plain, playful)

    return {
        "reply": reply,
        "files": [{"name": re.sub(r"_[0-9a-f]{8}\.pdf$", ".pdf", filename), "url": f"/downloads/{filename}"}],
        "options": [],
        "awaiting_area": False,
        "company": None,
        "history": remember(state, reply),
    }


def chat_node(state):
    reply = answer(state["query"], state.get("mode", "professional"), state.get("history", []))
    if reply.startswith("[Error"):
        return {"reply": reply}
    return {"reply": reply, "history": remember(state, reply)}


graph = StateGraph(State)
graph.add_node("classify", classify)
graph.add_node("ask_area", ask_area)
graph.add_node("make_cv", make_cv)
graph.add_node("chat", chat_node)
graph.add_edge(START, "classify")
graph.add_conditional_edges("classify", lambda state: state["intent"], {"ask": "ask_area", "make": "make_cv", "chat": "chat"})
for node_name in ("ask_area", "make_cv", "chat"):
    graph.add_edge(node_name, END)
flow_app = graph.compile(checkpointer=MemorySaver())


def run_flow(query, mode="professional", session_id="default"):
    result = flow_app.invoke(
        {"query": query, "mode": mode, "intent": "", "area": None, "reply": "", "files": [], "options": []},
        config={"configurable": {"thread_id": session_id}},
    )
    return {
        "response": result["reply"],
        "files": result.get("files", []),
        "options": result.get("options", []),
    }


if __name__ == "__main__":
    print("Elara flow test (type 'quit' to exit)\n")
    while True:
        text = input("You: ")
        if text.lower() == "quit":
            break
        out = run_flow(text, session_id="cli")
        print(f"\nElara: {out['response']}")
        if out["options"]:
            print("Options:", " | ".join(out["options"]))
        for item in out["files"]:
            print("File:", item["name"], item["url"])
        print()
