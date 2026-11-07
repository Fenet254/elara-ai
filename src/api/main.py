import re

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from src.generation.flow import CV_DIR, run_flow

app = FastAPI(title="Elara API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    query: str
    mode: str = "professional"
    session_id: str = "default"


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat")
def chat_endpoint(req: ChatRequest):
    return run_flow(req.query, req.mode, req.session_id)


@app.get("/downloads/{filename}")
def download(filename: str):
    path = (CV_DIR / filename).resolve()
    if path.parent != CV_DIR.resolve() or path.suffix != ".pdf" or not path.is_file():
        raise HTTPException(status_code=404)
    clean_name = re.sub(r"_[0-9a-f]{8}\.pdf$", ".pdf", path.name)
    return FileResponse(path, media_type="application/pdf", filename=clean_name)
