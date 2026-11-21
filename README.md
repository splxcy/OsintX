<div align="center">

# 🔍 OsintX

### AI-Powered OSINT Platform for Public Data Analysis

[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)]()

[![GitHub stars](https://img.shields.io/github/stars/splxcy/OsintX?style=social)](https://github.com/splxcy/OsintX/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/splxcy/OsintX?style=social)](https://github.com/splxcy/OsintX/network/members)
[![GitHub issues](https://img.shields.io/github/issues/splxcy/OsintX)](https://github.com/splxcy/OsintX/issues)

**Breach & Stealer Log Lookup · Password Check · Usernames · Domains · GitHub · AI Reports**

[🌐 Live Demo](https://osintx-cx0g.onrender.com/) · [Features](#-features) · [Screenshots](#-screenshots) · [Installation](#-installation) · [API](#-rest-api) · [🇪🇸 Español](README.es.md)

</div>

---

## 🌐 Try It Live

<div align="center">

### 🚀 **[https://osintx-cx0g.onrender.com/](https://osintx-cx0g.onrender.com/)**

*Public Render free-tier demo — may take ~30s to wake up on cold start*

</div>

> 💡 **Want unlimited access or full privacy?** Run your own local or self-hosted instance using the [installation guide](#-installation).

---

## 💡 What is OsintX?

**OsintX** is an open-source Open-Source Intelligence (OSINT) web platform that unifies public data investigation across emails, usernames, domains, and profiles in a single dashboard, combining free APIs with AI-assisted analysis.

**100% open source under the MIT License.** Clone it, customize it, self-host it, and extend it with new sources.

---

## 📸 Screenshots

<div align="center">

### Main Dashboard

![Dashboard](docs/screenshots/dashboard.png)

### Breach & Stealer Log Lookup

![Breaches](docs/screenshots/breaches.png)

### AI-Assisted Analysis

![AI](docs/screenshots/ai.png)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔓 Stealer Log & Breach Lookup
Check if an email appears in malware **stealer logs** (RedLine, Raccoon, etc.) via **Hudson Rock**.

### 🔐 Password Exposure Check
Verify whether a password has been leaked using **k-anonymity** (Pwned Passwords). Your password is never sent in full.

### 👤 Username Enumeration
Search a username across **12+ platforms**: GitHub, Reddit, Twitter/X, Instagram, TikTok, Twitch, Steam, and more.

</td>
<td width="50%">

### 🐙 GitHub Intelligence
Inspect user profiles, repositories, recent activity, languages, and stats.

### 🌐 Domain Intelligence
Query DNS records (`A`, `MX`, `TXT`, `NS`), subdomains via **crt.sh**, and domain metadata.

### 🤖 AI Analysis
Generate structured summaries with **Groq, OpenAI, OpenRouter, or Ollama** (any OpenAI-compatible endpoint).

</td>
</tr>
</table>

---

## 📋 Prerequisites

| Tool | Version | Check Command | Download |
| :--- | :--- | :--- | :--- |
| **Python** | 3.11+ | `python --version` | [python.org](https://www.python.org/downloads/) |
| **Git** | 2.30+ | `git --version` | [git-scm.com](https://git-scm.com/downloads) |

> ⚠️ **On Windows**, check **"Add Python to PATH"** during installation.

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone [https://github.com/splxcy/OsintX.git](https://github.com/splxcy/OsintX.git)
cd OsintX/backend
```

### 2. Create and activate a virtual environment

**Windows (PowerShell):**

```powershell
python -m venv venv
.\venv\Scripts\activate
```

**macOS / Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables (`.env`)

Copy the example file:

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Generate a `SECRET_KEY`:

```powershell
# Windows PowerShell
$bytes = New-Object byte[] 32; [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes); -join ($bytes | ForEach-Object { $_.ToString("x2") })
```

```bash
# macOS / Linux
openssl rand -hex 32
```

Edit `.env`:

```env
SECRET_KEY=paste_your_generated_key_here
AI_API_KEY=gsk_your_key_here
AI_BASE_URL=[https://api.groq.com/openai/v1](https://api.groq.com/openai/v1)
AI_MODEL=openai/gpt-oss-120b
GITHUB_TOKEN=ghp_your_optional_token_here
```

### 5. Start the server

```bash
uvicorn main:app --reload
```

Open your browser at `http://localhost:8000`.

---

## 🔑 API Keys Guide

| Service | Sign-up Required | Cost | How to Get It |
| :--- | :---: | :---: | :--- |
| **Hudson Rock** | ❌ No | 🟢 Free | Works out of the box with no key |
| **Pwned Passwords** | ❌ No | 🟢 Free | Uses public *k-anonymity* API |
| **Groq (AI)** | ✅ Yes | 🟢 Free | Create a key at [console.groq.com](https://console.groq.com/keys) |
| **GitHub Token** | ✅ Yes | 🟢 Free | Classic token at [github.com/settings/tokens](https://github.com/settings/tokens) |

---

## 🔌 REST API

Interactive OpenAPI docs available at `http://localhost:8000/docs`.

```bash
# Breach / stealer log lookup
curl -X POST http://localhost:8000/api/breaches \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Password breach check
curl -X POST http://localhost:8000/api/breaches/password \
  -H "Content-Type: application/json" \
  -d '{"password": "123456"}'

# Username search
curl -X POST http://localhost:8000/api/username \
  -H "Content-Type: application/json" \
  -d '{"username": "torvalds"}'

# Domain DNS & recon
curl -X POST http://localhost:8000/api/domain \
  -H "Content-Type: application/json" \
  -d '{"domain": "github.com"}'
```

---

## 🛠️ Tech Stack

| Backend | Frontend | AI / LLMs | Storage |
| :---: | :---: | :---: | :---: |
| FastAPI | HTML5 | Groq API | SQLite |
| Uvicorn | CSS3 | OpenAI / Ollama | PostgreSQL |
| SQLAlchemy | JavaScript | OpenRouter | |
| Pydantic | | | |

---

## 📁 Project Structure

```text
OsintX/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── config.py            # Settings & .env config
│   ├── database.py          # SQLAlchemy ORM
│   ├── auth.py              # JWT auth & password hashing
│   ├── routers/
│   │   ├── auth_router.py   # Register / login routes
│   │   ├── breaches.py      # Stealer logs & password checks
│   │   ├── username.py      # 12+ platform username lookup
│   │   ├── github.py        # GitHub profile & repo analysis
│   │   ├── domain.py        # DNS & crt.sh subdomains
│   │   └── ai.py            # LLM report generation
│   ├── static/              # Frontend assets
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment template
├── docs/
│   └── screenshots/         # README screenshots
├── README.md
├── README.es.md
└── LICENSE
```

---

## 🔧 Troubleshooting

| Issue | Likely Cause | Fix |
| :--- | :--- | :--- |
| `python is not recognized` | Python not in `PATH` | Reinstall checking **"Add Python to PATH"** |
| `cannot load Activate.ps1` | PowerShell execution policy | Run `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| `ModuleNotFoundError: fastapi` | Virtual environment inactive | Run `.\venv\Scripts\activate` |
| `error building wheel for pydantic-core` | Unsupported Python version | Use Python 3.11 or 3.12 |
| `[Errno 10048] Address in use` | Port 8000 already bound | Start with `--port 8001` |

---

## 🐳 Docker (Optional)

```bash
docker build -t osintx backend/
docker run -p 8000:8000 --env-file backend/.env osintx
```

---

## 🤝 Contributing

Contributions are welcome!

1. **Fork** the repository
2. Create a branch: `git checkout -b feature/shodan-integration`
3. Commit your changes: `git commit -m 'feat: add Shodan integration'`
4. Push: `git push origin feature/shodan-integration`
5. Open a **Pull Request**

---

## ⚖️ Ethical & Legal Use

- 🟢 **Allowed:** Authorized security assessments, checking your own exposure, consented research or journalism.
- 🔴 **Prohibited:** Harassment, doxing, unauthorized surveillance, or violating privacy laws (GDPR, CCPA).

> **⚠️ Users are solely responsible for how they use this tool.**

---

## 📄 License

Licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

<div align="center">

### ⭐ If OsintX helps your workflow, give it a star! ⭐

**Built with ❤️ by [splxcy](https://github.com/splxcy)**

[🌐 Live Demo](https://osintx-cx0g.onrender.com/) · [🐛 Report an Issue](https://github.com/splxcy/OsintX/issues)

</div>
