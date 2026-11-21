from fastapi import APIRouter
from pydantic import BaseModel
import httpx, asyncio

router = APIRouter(prefix="/api/username", tags=["username"])

class Q(BaseModel):
    username: str

PLATFORMS = {
    "GitHub": "https://github.com/{u}",
    "Reddit": "https://www.reddit.com/user/{u}/about.json",
    "Twitter/X": "https://twitter.com/{u}",
    "Instagram": "https://www.instagram.com/{u}/",
    "TikTok": "https://www.tiktok.com/@{u}",
    "Pinterest": "https://www.pinterest.com/{u}/",
    "Twitch": "https://www.twitch.tv/{u}",
    "Steam": "https://steamcommunity.com/id/{u}",
    "Medium": "https://medium.com/@{u}",
    "Dev.to": "https://dev.to/{u}",
    "GitLab": "https://gitlab.com/{u}",
    "Bitbucket": "https://bitbucket.org/{u}/",
}

@router.post("")
async def search(q: Q):
    results = []
    async def probe(name, url):
        try:
            async with httpx.AsyncClient(timeout=8, follow_redirects=True) as http:
                r = await http.get(url, headers={"User-Agent": "Mozilla/5.0"})
                results.append({"platform": name, "url": url, "exists": r.status_code == 200})
        except Exception as e:
            results.append({"platform": name, "url": url, "exists": False, "error": str(e)[:60]})
    await asyncio.gather(*[probe(n, u.format(u=q.username)) for n, u in PLATFORMS.items()])
    return {"username": q.username, "found": [r for r in results if r["exists"]], "all": results}
