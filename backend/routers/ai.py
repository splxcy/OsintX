from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from config import settings

router = APIRouter(prefix="/api/ai", tags=["ai"])

class AnalyzeIn(BaseModel):
    target: str
    data: dict
    question: str = "Resume hallazgos y riesgos de privacidad."

def client():
    if not settings.AI_API_KEY: raise HTTPException(400, "Falta AI_API_KEY en .env")
    return OpenAI(api_key=settings.AI_API_KEY, base_url=settings.AI_BASE_URL)

@router.post("/analyze")
async def analyze(req: AnalyzeIn):
    c = client()
    prompt = f"Analista OSINT. Datos sobre '{req.target}':\n{req.data}\n\nTarea: {req.question}\n\nResponde en espanol, estructurado."
    try:
        r = c.chat.completions.create(
            model=settings.AI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )
        return {"analysis": r.choices[0].message.content}
    except Exception as e:
        raise HTTPException(500, f"Error IA: {e}")
