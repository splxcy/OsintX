from fastapi import APIRouter
from pydantic import BaseModel
import httpx

router = APIRouter(prefix="/api/domain", tags=["domain"])

class Q(BaseModel):
    domain: str

@router.post("")
async def lookup(q: Q):
    out = {"domain": q.domain, "dns": {}, "subdomains": []}
    async with httpx.AsyncClient(timeout=15) as http:
        for t in ["A", "MX", "TXT", "NS"]:
            try:
                r = await http.get(f"https://dns.google/resolve?name={q.domain}&type={t}")
                out["dns"][t] = [a.get("data") for a in r.json().get("Answer", [])]
            except Exception: out["dns"][t] = []
        try:
            r = await http.get(f"https://crt.sh/?q=%25.{q.domain}&output=json", timeout=25)
            if r.status_code == 200:
                out["subdomains"] = sorted({c["name_value"] for c in r.json()})[:100]
        except Exception: pass
    return out
