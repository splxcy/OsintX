from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
from config import settings

router = APIRouter(prefix="/api/github", tags=["github"])

class Q(BaseModel):
    username: str

@router.post("")
async def lookup(q: Q):
    headers = {"Accept": "application/vnd.github+json"}
    if settings.GITHUB_TOKEN: headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"
    async with httpx.AsyncClient(timeout=15) as http:
        r = await http.get(f"https://api.github.com/users/{q.username}", headers=headers)
        if r.status_code != 200: raise HTTPException(404, "Usuario no existe en GitHub")
        u = r.json()
        rr = await http.get(f"https://api.github.com/users/{q.username}/repos?per_page=10&sort=updated", headers=headers)
        repos = rr.json() if rr.status_code == 200 else []
    return {
        "username": u["login"], "name": u.get("name"), "bio": u.get("bio"),
        "location": u.get("location"), "company": u.get("company"),
        "public_repos": u.get("public_repos"), "followers": u.get("followers"),
        "top_repos": [{"name": x["name"], "url": x["html_url"], "desc": x.get("description"),
                       "stars": x["stargazers_count"]} for x in repos[:10]],
    }
