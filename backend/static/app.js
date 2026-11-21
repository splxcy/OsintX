const API = "";
let token = localStorage.getItem("osintx_token") || null;
let userEmail = localStorage.getItem("osintx_email") || null;
let mode = "breaches";
let lastData = null, lastTarget = "", lastAI = null;
let authMode = "login";

const TABS = [
  {id:"breaches",label:"🔓 Filtraciones"},
  {id:"username",label:"👤 Username"},
  {id:"github",label:"🐙 GitHub"},
  {id:"domain",label:"🌐 Dominio"},
];
const HINTS = {
  breaches:"Email para comprobar filtraciones (usa Hudson Rock, gratis).",
  username:"Ej: torvalds — busca el usuario en 12 plataformas públicas.",
  github:"Ej: torvalds — perfil, repos y actividad.",
  domain:"Ej: github.com — DNS y subdominios.",
};

function authHeaders(){ return token ? {"Authorization":"Bearer "+token} : {}; }

function buildTabs(){
  const el = document.getElementById("tabs"); el.innerHTML="";
  TABS.forEach(t=>{
    const d=document.createElement("div");
    d.className="tab"+(t.id===mode?" active":"");
    d.textContent=t.label;
    d.onclick=()=>{
      mode=t.id; buildTabs();
      document.getElementById("hint").textContent=HINTS[t.id];
      document.getElementById("results").innerHTML="<em class='muted'>Sin búsquedas aún</em>";
      document.getElementById("aiRow").style.display="none";
      document.getElementById("aiResult").innerHTML="";
      document.getElementById("timer").textContent="";
    };
    el.appendChild(d);
  });
}

function renderAuth(){
  const a=document.getElementById("authArea");
  if(userEmail){
    a.innerHTML=`<span class="user-pill">${userEmail}</span>
      <button onclick="logout()" class="btn-ghost">Salir</button>`;
  } else {
    a.innerHTML=`<button class="btn-secondary" onclick="openAuth()">Iniciar sesión</button>`;
  }
}

function openAuth(){ document.getElementById("authModal").classList.add("show"); document.getElementById("authError").textContent=""; }
function closeAuth(){ document.getElementById("authModal").classList.remove("show"); }
function toggleAuth(){
  authMode = authMode==="login"?"register":"login";
  document.getElementById("authTitle").textContent = authMode==="login"?"Iniciar sesión":"Crear cuenta";
  document.getElementById("authBtn").textContent = authMode==="login"?"Entrar":"Registrarme";
  document.getElementById("authToggle").textContent = authMode==="login"?"¿No tienes cuenta? Regístrate":"¿Ya tienes cuenta? Inicia sesión";
}

async function submitAuth(){
  const email=document.getElementById("authEmail").value.trim();
  const password=document.getElementById("authPass").value;
  const err=document.getElementById("authError"); err.textContent="";
  try{
    let r;
    if(authMode==="register"){
      r=await fetch(API+"/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
    } else {
      const form=new URLSearchParams({username:email,password});
      r=await fetch(API+"/api/auth/login",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:form.toString()});
    }
    const d=await r.json();
    if(!r.ok) throw new Error(d.detail||"Error");
    token=d.access_token; userEmail=d.email;
    localStorage.setItem("osintx_token",token);
    localStorage.setItem("osintx_email",userEmail);
    closeAuth(); renderAuth();
  } catch(e){ err.textContent=e.message; }
}

function logout(){
  token=null; userEmail=null;
  localStorage.removeItem("osintx_token");
  localStorage.removeItem("osintx_email");
  renderAuth();
}

async function loadHealth(){
  try{
    const r=await fetch(API+"/api/health"); const d=await r.json();
    const labels = {
      ai: "🤖 IA",
      github: "🐙 GitHub",
      hudson: "🕵️ Hudson Rock",
      pwned_pw: "🔐 Pwned Passwords",
      hibp: "📋 HIBP"
    };
    document.getElementById("status").innerHTML = Object.entries(d.configured)
      .map(([k,v])=>{
        const lbl = labels[k] || k;
        const cls = v ? "on" : "off";
        const badgeCls = v ? "ok" : "info";
        return `<span class="badge ${badgeCls}"><span class="status-dot ${cls}"></span>${lbl}</span>`;
      }).join("");
  } catch {
    document.getElementById("status").innerHTML = `<span class="badge warn">Backend offline</span>`;
  }
}

async function run(){
  const t=document.getElementById("target").value.trim();
  if(!t) return;
  lastTarget=t;
  const map={
    breaches:["/api/breaches",{email:t}],
    username:["/api/username",{username:t}],
    github:["/api/github",{username:t}],
    domain:["/api/domain",{domain:t}],
  };
  const [path,body]=map[mode];
  await doFetch(path, body);
}

async function doFetch(path, body){
  const res=document.getElementById("results");
  const timer=document.getElementById("timer");
  res.innerHTML = `<em class="muted">Analizando…</em>`;
  timer.textContent = "";
  const start = performance.now();
  try{
    const r=await fetch(API+path,{method:"POST",headers:{"Content-Type":"application/json",...authHeaders()},body:JSON.stringify(body)});
    const data=await r.json();
    if(!r.ok) throw new Error(data.detail||"Error");
    lastData=data;
    timer.textContent = `· ${((performance.now()-start)/1000).toFixed(2)}s`;
    res.innerHTML=render(data);
    document.getElementById("aiRow").style.display="block";
    document.getElementById("aiResult").innerHTML="";
    lastAI=null;
  } catch(e){
    res.innerHTML=`<span class="error">❌ ${e.message}</span>`;
  }
}

function render(d){
  if(mode==="breaches"){
    if(!d.sources) return `<pre>${JSON.stringify(d,null,2)}</pre>`;
    let html = `<div class="result-meta" style="margin-bottom:14px"><strong>Resumen:</strong> ${d.summary||""}</div>`;
    for(const src of d.sources){
      if(src.error){
        html += `<div class="result-card warn">
          <div class="result-title">${src.source}<span class="tag warn">error</span></div>
          <div class="result-meta">${src.error}</div>
        </div>`;
        continue;
      }
      const cardClass = src.count > 0 ? "warn" : "ok";
      html += `<div class="result-card ${cardClass}">
        <div class="result-title">
          ${src.source}
          <span class="tag ${src.count?'warn':'ok'}">${src.count||0} hallazgos</span>
        </div>`;
      if(src.infections?.length){
        html += src.infections.map(i=>`
          <div style="margin-top:10px;padding:10px;background:rgba(239,68,68,.06);border-left:2px solid var(--red);border-radius:6px">
            <div style="color:var(--red);font-weight:600;margin-bottom:6px">💀 Infección detectada</div>
            <div class="result-meta">
              <strong>Fecha:</strong> ${i.date_compromised||"?"} ·
              <strong>PC:</strong> ${i.computer_name||"?"} ·
              <strong>OS:</strong> ${i.operating_system||"?"}
            </div>
            <div class="result-meta"><strong>IP:</strong> ${i.ip||"?"} · <strong>Malware:</strong> ${i.malware||"?"}</div>
            ${i.top_logins?.length?`<div style="margin-top:6px">${i.top_logins.map(l=>`<span class="tag info">${l}</span>`).join("")}</div>`:""}
          </div>`).join("");
      } else if(src.count === 0){
        html += `<div class="result-meta" style="margin-top:6px;color:var(--green)">✓ Sin hallazgos en esta fuente</div>`;
      }
      html += `</div>`;
    }
    return html;
  }

  if(mode==="username"){
    const f=d.found||[];
    if(!f.length) return `<div class="result-meta">No encontrado en ninguna plataforma.</div>`;
    return `<div class="result-meta" style="margin-bottom:12px">Encontrado en <strong>${f.length}</strong> plataformas:</div>
      <div>${f.map(x=>`<a href="${x.url}" target="_blank" class="tag ok" style="text-decoration:none;padding:6px 12px;font-size:.8rem">${x.platform}</a>`).join("")}</div>`;
  }

  if(mode==="github"){
    return `<div class="result-card">
      <div class="result-title">${d.name||d.username} <span class="tag info">@${d.username}</span></div>
      <div class="result-meta">
        📍 ${d.location||"—"} · 🏢 ${d.company||"—"} · 👥 <strong>${d.followers||0}</strong> seguidores · 📦 <strong>${d.public_repos||0}</strong> repos
      </div>
      ${d.bio?`<div class="result-meta" style="margin-top:8px;font-style:italic">"${d.bio}"</div>`:""}
    </div>
    <div style="margin-top:14px"><strong style="color:var(--purple)">Top repos</strong></div>
    ${d.top_repos?.length ? d.top_repos.map(r=>`
      <div class="result-card ok">
        <div class="result-title">
          <a href="${r.url}" target="_blank">${r.name}</a>
          <span class="tag ok">⭐ ${r.stars}</span>
        </div>
        <div class="result-meta">${r.desc||"Sin descripción"}</div>
      </div>`).join("") : `<div class="result-meta">Sin repos</div>`}`;
  }

  if(mode==="domain"){
    let html = `<div class="result-card ok">
      <div class="result-title">🌐 ${d.domain}</div>
      <div class="result-meta"><strong>Subdominios encontrados:</strong> ${d.subdomains?.length||0}</div>
    </div>
    <div style="margin-top:14px"><strong style="color:var(--cyan)">Registros DNS</strong></div>`;
    for(const [type, records] of Object.entries(d.dns||{})){
      if(!records?.length) continue;
      html += `<div class="result-card">
        <div class="result-title">${type} <span class="tag info">${records.length}</span></div>
        <div class="result-meta">${records.map(r=>`<div style="font-family:monospace;font-size:.78rem;margin:2px 0">${r}</div>`).join("")}</div>
      </div>`;
    }
    if(d.subdomains?.length){
      html += `<div style="margin-top:14px"><strong style="color:var(--cyan)">Subdominios</strong></div>
        <div style="margin-top:8px">${d.subdomains.slice(0,50).map(s=>`<span class="tag">${s}</span>`).join("")}</div>`;
    }
    return html;
  }

  return `<pre>${JSON.stringify(d,null,2)}</pre>`;
}

async function checkPassword(){
  const pwd = document.getElementById("pwdInput").value;
  if(!pwd) return;
  const box = document.getElementById("pwdResult");
  box.innerHTML = `<span class="muted">Verificando (tu contraseña nunca se envía completa)…</span>`;
  try{
    const r = await fetch(API+"/api/breaches/password", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({password: pwd})
    });
    const d = await r.json();
    const ok = d.pwned ? "warn" : "ok";
    const icon = d.pwned ? "⚠️" : "✅";
    box.innerHTML = `<div class="result-card ${ok}">
      <div class="result-title">${icon} ${d.message}</div>
    </div>`;
  } catch(e){ box.innerHTML = `<span class="error">${e.message}</span>`; }
}

async function analyzeAI(){
  if(!lastData) return;
  const box=document.getElementById("aiResult");
  box.innerHTML = `<div style="margin-top:16px"><span class="muted">Analizando con IA…</span></div>`;
  try{
    const r=await fetch(API+"/api/ai/analyze",{method:"POST",headers:{"Content-Type":"application/json",...authHeaders()},
      body:JSON.stringify({target:lastTarget,data:lastData})});
    const d=await r.json();
    if(!r.ok) throw new Error(d.detail||"Error");
    lastAI=d.analysis;
    box.innerHTML=`<pre>${d.analysis}</pre>`;
  } catch(e){
    box.innerHTML=`<div class="result-card warn" style="margin-top:16px">
      <div class="result-title">Error IA</div>
      <div class="result-meta">${e.message}</div>
    </div>`;
  }
}

async function exportAs(fmt){
  if(!lastData) return;
  const r = await fetch(API+"/api/export", {
    method:"POST",
    headers:{"Content-Type":"application/json",...authHeaders()},
    body: JSON.stringify({format: fmt, target: lastTarget, results: lastData, ai_analysis: lastAI}),
  });
  if(!r.ok) { alert("Exportación no disponible en esta versión"); return; }
  const blob = await r.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `osintx_${lastTarget.replace(/[^a-z0-9]/gi,"_")}.${fmt}`;
  a.click();
}

function addMsg(role, text){
  const box = document.getElementById("chatBox");
  const d = document.createElement("div");
  d.className = "msg " + role;
  d.textContent = text;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

// INIT
buildTabs();
renderAuth();
loadHealth();
document.getElementById("hint").textContent = HINTS["breaches"];

// Enter para buscar
document.getElementById("target").addEventListener("keydown", e => {
  if(e.key === "Enter") run();
});
document.getElementById("pwdInput").addEventListener("keydown", e => {
  if(e.key === "Enter") checkPassword();
});