import os
from dotenv import load_dotenv
load_dotenv()

class Settings:
    AI_API_KEY = os.getenv("AI_API_KEY", "")
    AI_BASE_URL = os.getenv("AI_BASE_URL", "https://api.openai.com/v1")
    AI_MODEL = os.getenv("AI_MODEL", "gpt-4o-mini")
    HIBP_KEY = os.getenv("HIBP_KEY", "")
    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./osintx.db")
    SECRET_KEY = os.getenv("SECRET_KEY", "cambia-esto")
    ALGORITHM = "HS256"
    TOKEN_EXPIRE_MIN = int(os.getenv("TOKEN_EXPIRE_MIN", "10080"))

settings = Settings()
