<!-- Banner -->
<div align="center">

# 🔍 OSINTX

### Plataforma OSINT con IA para análisis de datos públicos

[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)]()

[![GitHub stars](https://img.shields.io/github/stars/TU-USUARIO/osintx?style=social)](https://github.com/TU-USUARIO/osintx/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/TU-USUARIO/osintx?style=social)](https://github.com/TU-USUARIO/osintx/network/members)
[![GitHub issues](https://img.shields.io/github/issues/TU-USUARIO/osintx)](https://github.com/TU-USUARIO/osintx/issues)

**Análisis de filtraciones · Verificación de contraseñas · Usernames · Dominios · GitHub · IA**

[Instalación](#-instalación) · [Características](#-características) · [Capturas](#-capturas) · [Uso](#-uso) · [Contribuir](#-contribuir)

</div>

---

## 📸 Capturas

<div align="center">

### Interfaz principal

![Dashboard](docs/screenshots/dashboard.png)

### Análisis de filtraciones

![Filtraciones](docs/screenshots/breaches.png)

### Análisis con IA

![IA](docs/screenshots/ai.png)

</div>

> ⚠️ *Reemplaza estas imágenes por capturas reales de tu app. Instrucciones abajo.*

---

## ✨ Características

<table>
<tr>
<td width="50%">

### 🔓 Filtraciones de malware
Verifica si un email aparece en **stealer logs** de malware (RedLine, Raccoon, etc.) vía **Hudson Rock**.

### 🔐 Verificador de contraseñas
Comprueba si una contraseña fue filtrada usando **k-anonymity** (Pwned Passwords). Tu contraseña nunca se envía completa.

### 👤 Búsqueda de usernames
Rastrea un username en **12+ plataformas**: GitHub, Reddit, Twitter, Instagram, TikTok, Twitch, Steam y más.

</td>
<td width="50%">

### 🐙 Análisis de GitHub
Perfil completo, repositorios, actividad reciente y estadísticas.

### 🌐 Inteligencia de dominios
Registros DNS (A, MX, TXT, NS), subdominios vía **crt.sh** y metadatos.

### 🤖 Análisis con IA
Informes automáticos con **Groq, OpenAI, OpenRouter u Ollama**. Compatible con cualquier endpoint OpenAI.

</td>
</tr>
</table>

---

## 🚀 Instalación

### Requisitos previos

- **Python 3.11+** → [Descargar](https://www.python.org/downloads/)
- **Git** → [Descargar](https://git-scm.com/downloads)

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/osintx.git
cd osintx/backend
