<!-- Banner -->
<div align="center">
🔍 OSINTX
Plataforma OSINT con IA para análisis de datos públicos
![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)]()
![GitHub stars](https://img.shields.io/github/stars/splxcy/osintx?style=social)
![GitHub forks](https://img.shields.io/github/forks/splxcy/osintx?style=social)
![GitHub issues](https://img.shields.io/github/issues/splxcy/osintx)
Análisis de filtraciones · Verificación de contraseñas · Usernames · Dominios · GitHub · IA
🌐 Demo en vivo · Características · Capturas · Instalación · API · Contribuir
</div>
---
🌐 Pruébalo online
<div align="center">
🚀 https://osintx-cx0g.onrender.com/
Demo pública en Render — plan gratuito, puede tardar ~30 s en despertar
</div>
> 💡 **¿Quieres tu propia instancia local o en servidor privado?** Sigue el [tutorial de instalación](#-instalación).
---
💡 ¿Qué es OSINTX?
OSINTX es una plataforma de inteligencia de fuentes abiertas (OSINT) que centraliza en una sola interfaz web el análisis de datos públicos sobre emails, usernames, dominios y perfiles. Combina múltiples APIs gratuitas con análisis asistido por IA.
Es 100% código abierto bajo licencia MIT. Puedes clonarlo, modificarlo, mejorarlo y desplegarlo donde quieras.
---
📸 Capturas
<div align="center">
Interfaz principal
![Dashboard](docs/screenshots/dashboard.png)
Análisis de filtraciones
![Filtraciones](docs/screenshots/breaches.png)
Análisis asistido por IA
![IA](docs/screenshots/ai.png)
</div>
---
✨ Características
<table>
<tr>
<td width="50%">
🔓 Filtraciones de malware
Verifica si un email aparece en stealer logs de malware (RedLine, Raccoon, etc.) vía Hudson Rock.
🔐 Verificador de contraseñas
Comprueba si una contraseña fue filtrada usando k-anonymity (Pwned Passwords). Tu contraseña nunca se envía completa.
👤 Búsqueda de usernames
Rastrea un username en 12+ plataformas: GitHub, Reddit, Twitter, Instagram, TikTok, Twitch, Steam y más.
</td>
<td width="50%">
🐙 Análisis de GitHub
Perfil completo, repositorios, actividad reciente, lenguajes y estadísticas.
🌐 Inteligencia de dominios
Registros DNS (A, MX, TXT, NS), subdominios vía crt.sh y metadatos.
🤖 Análisis con IA
Informes automáticos con Groq, OpenAI, OpenRouter u Ollama. Compatible con cualquier endpoint estilo OpenAI.
</td>
</tr>
</table>
---
📋 Requisitos previos
Herramienta	Versión	Comando de verificación	Enlace de descarga
Python	3.11+	`python --version`	python.org
Git	2.30+	`git --version`	git-scm.com
> ⚠️ **Al instalar Python en Windows**, marca siempre la casilla **"Add Python to PATH"**.
---
🚀 Instalación
1. Clonar el repositorio
```bash
git clone https://github.com/splxcy/osintx.git
cd osintx/backend
```
---
2. Crear y activar entorno virtual
Windows (PowerShell):
```powershell
python -m venv venv
.\venv\Scripts\activate
```
macOS / Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```
---
3. Instalar dependencias
```bash
pip install -r requirements.txt
```
---
4. Configurar variables de entorno (`.env`)
Copiar la plantilla de ejemplo:
```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```
Generar `SECRET_KEY` requerida:
```powershell
# Windows PowerShell
$bytes = New-Object byte[] 32; [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes); -join ($bytes | ForEach-Object { $_.ToString("x2") })
```
```bash
# macOS / Linux
openssl rand -hex 32
```
Edita tu archivo `.env`:
```env
SECRET_KEY=pega_aqui_tu_clave_generada
AI_API_KEY=gsk_tu_key_aqui
AI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=openai/gpt-oss-120b
GITHUB_TOKEN=ghp_tu_token_opcional
```
---
5. Iniciar la aplicación
```bash
uvicorn main:app --reload
```
Abre tu navegador en: `http://localhost:8000`
---
🔑 Configuración de API Keys
Servicio	Requiere Registro	Coste	Cómo obtenerla
Hudson Rock	❌ No	🟢 Gratis	Funciona por defecto sin API Key
Pwned Passwords	❌ No	🟢 Gratis	Utiliza k-anonymity públicamente
Groq (IA)	✅ Sí	🟢 Gratis	Registro en console.groq.com
GitHub Token	✅ Sí	🟢 Gratis	Crear token clásico en github.com/settings/tokens
---
🔌 API REST
Documentación OpenAPI interactiva disponible en `http://localhost:8000/docs`.
```bash
# Búsqueda de filtraciones por email
curl -X POST http://localhost:8000/api/breaches \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Verificación de contraseñas
curl -X POST http://localhost:8000/api/breaches/password \
  -H "Content-Type: application/json" \
  -d '{"password": "123456"}'

# Búsqueda de username
curl -X POST http://localhost:8000/api/username \
  -H "Content-Type: application/json" \
  -d '{"username": "torvalds"}'

# Análisis DNS de dominio
curl -X POST http://localhost:8000/api/domain \
  -H "Content-Type: application/json" \
  -d '{"domain": "github.com"}'
```
---
🛠️ Stack tecnológico
<div align="center">
Backend	Frontend	IA / Modelos	Almacenamiento
FastAPI	HTML5	Groq API	SQLite
Uvicorn	CSS3	OpenAI / Ollama	PostgreSQL
SQLAlchemy	JavaScript	OpenRouter	
Pydantic			
</div>
---
📁 Estructura del proyecto
```
osintx/
├── backend/
│   ├── main.py              # Punto de entrada FastAPI
│   ├── config.py            # Configuración y variables .env
│   ├── database.py          # SQLAlchemy ORM
│   ├── auth.py              # Autenticación JWT y hashing
│   ├── routers/
│   │   ├── auth_router.py   # Endpoints de Login / Registro
│   │   ├── breaches.py      # Integraciones Stealer logs & HIBP
│   │   ├── username.py      # Búsqueda en 12+ redes sociales
│   │   ├── github.py        # Módulo GitHub API
│   │   ├── domain.py        # DNS & subdominios (crt.sh)
│   │   └── ai.py            # Generación de informes con LLM
│   ├── static/              # Archivos web estáticos
│   ├── requirements.txt     # Dependencias del backend
│   └── .env.example         # Plantilla de variables de entorno
├── docs/
│   └── screenshots/         # Capturas para el README
├── README.md
└── LICENSE
```
---
🔧 Solución de problemas
Problema	Causa probable	Solución
`python no se reconoce...`	Python no está agregado al PATH	Reinstalar marcando "Add Python to PATH"
`no se puede cargar Activate.ps1`	Política de ejecución de PowerShell	Ejecutar: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`
`ModuleNotFoundError: fastapi`	Entorno virtual desactivado	Ejecutar: `.\venv\Scripts\activate`
`error building wheel for pydantic-core`	Versión de Python incompatible	Usar Python 3.11 o 3.12
`[Errno 10048] Address in use`	Puerto 8000 ocupado	Arrancar con `--port 8001`
---
🐳 Docker (opcional)
```bash
docker build -t osintx backend/
docker run -p 8000:8000 --env-file backend/.env osintx
```
---
🤝 Contribuir
¡Las contribuciones son bienvenidísimas!
Realiza un Fork de este proyecto.
Crea tu rama de función: `git checkout -b feature/nueva-fuente`
Guarda los cambios: `git commit -m 'feat: añadir integración con Shodan'`
Envía la rama: `git push origin feature/nueva-fuente`
Abre un Pull Request.
---
⚖️ Uso ético y legal
🟢 Permitido: Auditorías de seguridad autorizadas, verificación personal, investigaciones periodísticas con consentimiento.
🔴 Prohibido: Acoso, doxing, vigilancia no autorizada o violación de leyes de privacidad (GDPR, CCPA).
El usuario es el único responsable del uso que le dé a esta plataforma.
---
📄 Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
---
<div align="center">
⭐ Si OSINTX te es de utilidad, ¡apóyanos con una estrella! ⭐
Desarrollado con ❤️ por splxcy
🌐 Demo · 🐛 Reportar Bug / Issue
</div>
