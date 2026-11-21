from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import hashlib
import asyncio
from config import settings

router = APIRouter(prefix="/api/breaches", tags=["breaches"])


class Q(BaseModel):
    email: str


class PwdQ(BaseModel):
    password: str


# ============ Hudson Rock Cavalier (SIN KEY) ============
async def check_hudson(email: str) -> dict:
    """Busca el email en logs de malware/stealer. Gratis, sin key."""
    try:
        async with httpx.AsyncClient(timeout=20) as http:
            r = await http.get(
                "https://cavalier.hudsonrock.com/api/json/v2/osint-tools/search-by-email",
                params={"email": email},
            )
        if r.status_code != 200:
            return {"source": "Hudson Rock", "error": f"HTTP {r.status_code}"}

        data = r.json()

        if not data or ("message" in data and not data.get("data")):
            return {"source": "Hudson Rock", "count": 0, "infections": []}

        infections = []
        if isinstance(data.get("data"), dict):
            infections = data["data"].get("stealers") or []
        elif isinstance(data.get("data"), list):
            infections = data["data"]
        elif data.get("stealers"):
            infections = data["stealers"]

        parsed = []
        for inf in infections[:20]:
            parsed.append({
                "computer_name": inf.get("computer_name") or inf.get("machineName"),
                "operating_system": inf.get("operating_system") or inf.get("os"),
                "ip": inf.get("ip") or inf.get("ipAddress"),
                "malware": inf.get("malware_path") or inf.get("malwareFamily") or inf.get("stealer"),
                "date_compromised": inf.get("date_compromised") or inf.get("date"),
                "top_passwords": (inf.get("top_passwords") or [])[:3],
                "top_logins": (inf.get("top_logins") or [])[:3],
            })

        return {
            "source": "Hudson Rock",
            "count": len(parsed),
            "infections": parsed,
            "message": data.get("message", ""),
        }
    except Exception as e:
        return {"source": "Hudson Rock", "error": str(e)[:120]}


# ============ Endpoint principal ============
@router.post("")
async def check_all(q: Q):
    results = await asyncio.gather(
        check_hudson(q.email),
        return_exceptions=True,
    )

    sources = []
    total = 0
    for r in results:
        if isinstance(r, Exception):
            sources.append({"source": "?", "error": str(r)[:100]})
            continue
        sources.append(r)
        total += r.get("count", 0)

    parts = []
    for s in sources:
        name = s.get("source", "?")
        if s.get("error"):
            parts.append(f"{name}: error")
        else:
            c = s.get("count", 0)
            parts.append(f"{name}: {c} hallazgos" if c else f"{name}: limpio")

    return {
        "email": q.email,
        "total_findings": total,
        "sources": sources,
        "summary": " - ".join(parts),
    }


# ============ Pwned Passwords (SIN KEY) ============
@router.post("/password")
async def check_password(q: PwdQ):
    sha1 = hashlib.sha1(q.password.encode("utf-8")).hexdigest().upper()
    prefix, suffix = sha1[:5], sha1[5:]

    async with httpx.AsyncClient(timeout=15) as http:
        r = await http.get(f"https://api.pwnedpasswords.com/range/{prefix}")

    if r.status_code != 200:
        raise HTTPException(500, f"Error Pwned Passwords: {r.status_code}")

    count = 0
    for line in r.text.splitlines():
        parts = line.split(":")
        if len(parts) == 2 and parts[0] == suffix:
            count = int(parts[1])
            break

    return {
        "pwned": count > 0,
        "times_seen": count,
        "message": (
            f"ALERTA: esta contrasena aparece {count:,} veces en filtraciones. NO la uses."
            if count > 0
            else "OK: esta contrasena no aparece en filtraciones conocidas."
        ),
    }
