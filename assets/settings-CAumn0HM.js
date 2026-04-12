var ee=Object.defineProperty;var te=(s,e,t)=>e in s?ee(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var C=(s,e,t)=>te(s,typeof e!="symbol"?e+"":e,t);import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{a as se,e as ae,i as ne}from"./settings-persistence-BBfpQx-M.js";import{gw as L,gx as V,aM as T,gy as _,gz as E,aN as q,gA as k,as as M,gB as ie,b2 as U,g9 as oe,gt as le,gC as de,gs as ce,t as r,gD as R,gE as G,e as u,n as x,gF as z,gG as re,gH as ge,b3 as ve,i as ue,bk as Y,aY as pe,r as fe,gI as he}from"./panels-7a5dUcyv.js";import"./deck-stack-DGMK1c2g.js";import"./sentry-C2sjIlLb.js";import"./d3-A6Y4oGMQ.js";import"./i18n-qlunRAMb.js";class me{constructor(){C(this,"pendingSecrets",new Map);C(this,"validatedKeys",new Map);C(this,"validationMessages",new Map)}captureUnsavedInputs(e){e.querySelectorAll("input[data-secret]").forEach(n=>{var l;const o=n.dataset.secret;if(!o)return;const d=n.value.trim();if(!d||d===L)return;if(V.has(o)&&!this.pendingSecrets.has(o)){const v=((l=T().secrets[o])==null?void 0:l.value)||"";if(d===v)return}this.pendingSecrets.set(o,d);const c=_(o,d);c.valid||(this.validatedKeys.set(o,!1),this.validationMessages.set(o,c.hint||"Invalid format"))});const t=e.querySelector("select[data-model-select]"),i=e.querySelector("input[data-model-manual]"),a=(i&&!i.classList.contains("hidden-input")?i.value.trim():t==null?void 0:t.value)||"";a&&!this.pendingSecrets.has("OLLAMA_MODEL")&&(this.pendingSecrets.set("OLLAMA_MODEL",a),this.validatedKeys.set("OLLAMA_MODEL",!0))}hasPendingChanges(){return this.pendingSecrets.size>0}getMissingRequiredSecrets(){const e=[];for(const t of E){if(!q(t.id))continue;const i=k(t);if(i.some(n=>this.pendingSecrets.has(n)))for(const n of i)!M(n).valid&&!this.pendingSecrets.has(n)&&e.push(n)}return e}getValidationErrors(){const e=[];for(const[t,i]of this.pendingSecrets){const a=_(t,i);a.valid||e.push(`${t}: ${a.hint||"Invalid format"}`)}return e}async verifyPendingSecrets(){const e=[],t=Object.fromEntries(this.pendingSecrets.entries()),i=[];for(const[a,n]of this.pendingSecrets){const o=_(a,n);o.valid?i.push([a,n]):(this.validatedKeys.set(a,!1),this.validationMessages.set(a,o.hint||"Invalid format"),e.push(`${a}: ${o.hint||"Invalid format"}`))}if(i.length>0){const a=await Promise.race([Promise.all(i.map(async([n,o])=>{const d=await ie(n,o,t);return{key:n,result:d}})),new Promise(n=>setTimeout(()=>n(i.map(([o])=>({key:o,result:{valid:!0,message:"Saved (verification timed out)"}}))),15e3))]);for(const{key:n,result:o}of a)this.validatedKeys.set(n,o.valid),o.valid?this.validationMessages.delete(n):(this.validationMessages.set(n,o.message||"Verification failed"),e.push(`${n}: ${o.message||"Verification failed"}`))}return e}async commitVerifiedSecrets(){for(const[e,t]of this.pendingSecrets)this.validatedKeys.get(e)!==!1&&(await U(e,t),this.pendingSecrets.delete(e),this.validatedKeys.delete(e),this.validationMessages.delete(e))}setPending(e,t){this.pendingSecrets.set(e,t)}getPending(e){return this.pendingSecrets.get(e)}hasPending(e){return this.pendingSecrets.has(e)}deletePending(e){this.pendingSecrets.delete(e),this.validatedKeys.delete(e),this.validationMessages.delete(e)}setValidation(e,t,i){this.validatedKeys.set(e,t),i?this.validationMessages.set(e,i):this.validationMessages.delete(e)}getValidationState(e){return{validated:this.validatedKeys.get(e),message:this.validationMessages.get(e)}}destroy(){this.pendingSecrets.clear(),this.validatedKeys.clear(),this.validationMessages.clear()}}let $="overview",g,P=null;function h(s,e="ok"){const t=document.getElementById("settingsActionStatus");t&&(t.textContent=s,t.classList.remove("ok","error"),t.classList.add(e))}async function N(s,e){const t=await z(s);if(t){h(`${e}: ${t}`,"ok");return}h(r("modals.settingsWindow.invokeFail",{command:s}),"error")}function D(){z("close_settings_window").then(()=>{},()=>window.close())}function we(){return he()||""}let B=null;async function I(s,e){if(!B)try{B=await z("get_local_api_token")}catch{}const t=new Headers(e==null?void 0:e.headers);return B&&t.set("Authorization",`Bearer ${B}`),fetch(`${we()}${s}`,{...e,headers:t})}const W={overview:'<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 015.08 16zm2.95-8H5.08a7.987 7.987 0 014.33-3.56A15.65 15.65 0 008.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>',ai:'<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1s-2.73 7.08 0 9.79 7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58s9.14-3.49 12.65 0L21 3v7.12zM12.5 8v4.25l3.5 2.08-.72 1.21L11 13V8h1.5z"/></svg>',economy:'<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/></svg>',markets:'<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z"/></svg>',security:'<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>',tracking:'<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',debug:'<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"/></svg>'};function Q(s){let e=0;for(const t of s.features)x(t)&&e++;return{ready:e,total:s.features.length}}function X(){let s=0;for(const e of E)x(e.id)&&s++;return{ready:s,total:E.length}}function A(){const s=document.getElementById("sidebarNav");if(!s)return;const e=[],t=X(),i=t.ready===t.total?"dot-ok":t.ready>0?"dot-partial":"dot-warn";e.push(`
    <button class="settings-nav-item${$==="overview"?" active":""}" data-section="overview" role="tab" aria-selected="${$==="overview"}">
      ${W.overview}
      <span class="settings-nav-label">Overview</span>
      <span class="settings-nav-dot ${i}"></span>
    </button>
  `),e.push('<div class="settings-nav-sep"></div>');for(const a of R){const{ready:n,total:o}=Q(a),d=n===o?"dot-ok":n>0?"dot-partial":"dot-warn";e.push(`
      <button class="settings-nav-item${$===a.id?" active":""}" data-section="${a.id}" role="tab" aria-selected="${$===a.id}">
        ${W[a.id]||""}
        <span class="settings-nav-label">${u(a.label)}</span>
        <span class="settings-nav-count">${n}/${o}</span>
        <span class="settings-nav-dot ${d}"></span>
      </button>
    `)}e.push('<div class="settings-nav-sep"></div>'),e.push(`
    <button class="settings-nav-item${$==="debug"?" active":""}" data-section="debug" role="tab" aria-selected="${$==="debug"}">
      ${W.debug}
      <span class="settings-nav-label">Debug &amp; Logs</span>
    </button>
  `),s.innerHTML=e.join("")}function O(s){const e=document.getElementById("contentArea");e&&(P&&(P(),P=null),$=s,A(),e.classList.add("fade-out"),e.classList.remove("fade-in"),requestAnimationFrame(()=>{if(s==="overview")ye(e);else if(s==="debug")$e(e);else{const t=R.find(i=>i.id===s);t&&Le(e,t)}requestAnimationFrame(()=>{e.classList.remove("fade-out"),e.classList.add("fade-in")})}))}function ye(s){const{ready:e,total:t}=X(),i=t>0?e/t*100:0,a=2*Math.PI*40,n=a-i/100*a,o=e===t?"var(--settings-green)":e>0?"var(--settings-blue)":"var(--settings-yellow)",d=M("WORLDMONITOR_API_KEY"),c=d.present?"Active":"Not set",l=d.present?"ok":"warn",v=R.map(p=>{const{ready:m,total:f}=Q(p);return`<button class="settings-ov-cat ${m===f?"ov-cat-ok":m>0?"ov-cat-partial":"ov-cat-warn"}" data-section="${p.id}">
      <span class="settings-ov-cat-label">${u(p.label)}</span>
      <span class="settings-ov-cat-count">${m}/${f} ready</span>
    </button>`}).join("");s.innerHTML=`
    <div class="settings-overview">
      <div class="settings-ov-progress">
        <svg class="settings-ov-ring" viewBox="0 0 100 100" width="120" height="120">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"/>
          <circle cx="50" cy="50" r="40" fill="none" stroke="${o}" stroke-width="8"
            stroke-linecap="round" stroke-dasharray="${a}" stroke-dashoffset="${n}"
            transform="rotate(-90 50 50)" style="transition:stroke-dashoffset 0.6s ease"/>
        </svg>
        <div class="settings-ov-ring-text">
          <span class="settings-ov-ring-num">${e}</span>
          <span class="settings-ov-ring-label">of ${t} ready</span>
        </div>
      </div>
      <div class="settings-ov-cats">${v}</div>
    </div>

    <div class="settings-ov-license">
      <section class="wm-section">
        <h2 class="wm-section-title">${r("modals.settingsWindow.worldMonitor.apiKey.title")}</h2>
        <p class="wm-section-desc">${r("modals.settingsWindow.worldMonitor.apiKey.description")}</p>
        <div class="wm-key-row">
          <div class="wm-input-wrap">
            <input type="password" class="wm-input" data-wm-key-input
              placeholder="${r("modals.settingsWindow.worldMonitor.apiKey.placeholder")}"
              autocomplete="off" spellcheck="false"
              ${d.present?`value="${L}"`:""} />
            <button type="button" class="wm-toggle-vis" data-wm-toggle title="Show/hide">&#x1f441;</button>
          </div>
          <span class="wm-badge ${l}">${c}</span>
        </div>
      </section>

      <div class="wm-divider"><span>${r("modals.settingsWindow.worldMonitor.dividerOr")}</span></div>

      <section class="wm-section">
        <h2 class="wm-section-title">${r("modals.settingsWindow.worldMonitor.register.title")}</h2>
        <p class="wm-section-desc">${r("modals.settingsWindow.worldMonitor.register.description")}</p>
        <div class="wm-register-row">
          <button type="button" class="wm-submit-btn" data-wm-open-pro>
            ${r("modals.settingsWindow.worldMonitor.register.submitBtn")}
          </button>
        </div>
      </section>
    </div>
  `,be(s)}function be(s){var e,t,i;(e=s.querySelector("[data-wm-toggle]"))==null||e.addEventListener("click",()=>{const a=s.querySelector("[data-wm-key-input]");a&&(a.type=a.type==="password"?"text":"password")}),(t=s.querySelector("[data-wm-key-input]"))==null||t.addEventListener("input",a=>{const n=a.target;n.value.startsWith(L)&&(n.value=n.value.slice(L.length))}),(i=s.querySelector("[data-wm-open-pro]"))==null||i.addEventListener("click",()=>{const a="https://worldmonitor.app/pro";Y("open_url",{url:a}).catch(()=>window.open(a,"_blank"))}),s.querySelectorAll(".settings-ov-cat[data-section]").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.section;n&&O(n)})})}function Le(s,e){const i=e.features.map(a=>E.find(n=>n.id===a)).filter(Boolean).map(a=>{const n=q(a.id),o=x(a.id),d=k(a),c=!o&&d.every(w=>M(w).valid||g.hasPending(w)&&g.getValidationState(w).validated!==!1),l=o?"ready":c?"staged":"needs",v=o?"ok":c?"staged":"warn",p=o?"Ready":c?"Staged":"Needs keys",m=d.map(w=>Z(w,a.id)).join(""),f=o||c?"":`<p class="settings-feat-fallback">${u(a.fallback)}</p>`;return`
      <div class="settings-feat ${l}" data-feature-id="${a.id}">
        <div class="settings-feat-header" data-feat-toggle-expand="${a.id}">
          <label class="settings-feat-toggle-label" data-click-stop>
            <div class="settings-feat-switch">
              <input type="checkbox" data-toggle="${a.id}" ${n?"checked":""} />
              <span class="settings-feat-slider"></span>
            </div>
          </label>
          <div class="settings-feat-info">
            <span class="settings-feat-name">${u(a.name)}</span>
            <span class="settings-feat-desc">${u(a.description)}</span>
          </div>
          <span class="settings-feat-pill ${v}">${p}</span>
          <span class="settings-feat-chevron">&#x25B8;</span>
        </div>
        <div class="settings-feat-body">
          ${m}
          ${f}
        </div>
      </div>
    `}).join("");s.innerHTML=`
    <div class="settings-section-header">
      <h2>${u(e.label)}</h2>
    </div>
    <div class="settings-feat-list">${i}</div>
  `,J(s)}function Z(s,e){var b,y;const t=M(s),i=g.hasPending(s),{validated:a,message:n}=g.getValidationState(s),o=G[s]||s,d=re[s],c=V.has(s),l=d&&!t.present&&!i,v=i?a===!1?"Invalid":"Staged":t.present?t.valid?"Valid":"Looks invalid":"Missing",p=i?a===!1?"warn":"staged":t.valid?"ok":"warn",m=i?a===!1?"invalid":"valid-staged":"",f=i&&a===!1?n||"Invalid value":null;if(s==="OLLAMA_MODEL"){const S=i?g.getPending(s)||"":((b=T().secrets[s])==null?void 0:b.value)||"";return`
      <div class="settings-secret-row">
        <div class="settings-secret-label">${u(o)}</div>
        <span class="settings-secret-status ${p}">${u(v)}</span>
        <select data-model-select data-feature="${e}" class="${m}">
          ${S?`<option value="${u(S)}" selected>${u(S)}</option>`:'<option value="" selected disabled>Loading models...</option>'}
        </select>
        <input type="text" data-model-manual data-feature="${e}" class="${m} hidden-input"
          placeholder="Or type model name" autocomplete="off"
          ${S?`value="${u(S)}"`:""}>
        ${f?`<span class="settings-secret-hint">${u(f)}</span>`:""}
      </div>
    `}const w=l?`<a href="#" data-signup-url="${d}" class="settings-secret-link">Get key</a>`:"";return`
    <div class="settings-secret-row">
      <div class="settings-secret-label">${u(o)}</div>
      <span class="settings-secret-status ${p}">${u(v)}</span>
      <div class="settings-input-wrapper${l?" has-suffix":""}">
        <input type="${c?"text":"password"}" data-secret="${s}" data-feature="${e}"
          placeholder="${i?"Staged":"Enter value..."}" autocomplete="off" class="${m}"
          ${i?`value="${c?u(g.getPending(s)||""):L}"`:c&&t.present?`value="${u(((y=T().secrets[s])==null?void 0:y.value)||"")}"`:""}>
        ${w}
      </div>
      ${f?`<span class="settings-secret-hint">${u(f)}</span>`:""}
    </div>
  `}function J(s){s.querySelectorAll("[data-feat-toggle-expand]").forEach(t=>{t.addEventListener("click",i=>{if(i.target.closest("[data-click-stop]"))return;const a=t.closest(".settings-feat");a==null||a.classList.toggle("expanded")})}),s.querySelectorAll("input[data-toggle]").forEach(t=>{t.addEventListener("change",()=>{const i=t.dataset.toggle;i&&(ge(i,t.checked),ve(i,t.checked),A())})}),s.querySelectorAll("input[data-secret]").forEach(t=>{t.addEventListener("input",()=>{var n;const i=t.dataset.secret;if(!i)return;g.hasPending(i)&&t.value.startsWith(L)&&(t.value=t.value.slice(L.length)),g.setValidation(i,!0),t.classList.remove("valid-staged","invalid");const a=(n=t.closest(".settings-secret-row"))==null?void 0:n.querySelector(".settings-secret-hint");a&&a.remove()}),t.addEventListener("blur",()=>{var l;const i=t.dataset.secret;if(!i)return;const a=t.value.trim();if(!a){g.hasPending(i)&&(g.deletePending(i),O($));return}if(a===L)return;g.setPending(i,a);const n=_(i,a);n.valid?g.setValidation(i,!0):g.setValidation(i,!1,n.hint||"Invalid format"),V.has(i)?t.value=a:(t.type="password",t.value=L),t.classList.remove("valid-staged","invalid"),t.classList.add(n.valid?"valid-staged":"invalid");const o=(l=t.closest(".settings-secret-row"))==null?void 0:l.querySelector(".settings-secret-status");o&&(o.textContent=n.valid?"Staged":"Invalid",o.className=`settings-secret-status ${n.valid?"staged":"warn"}`);const d=t.closest(".settings-secret-row"),c=d==null?void 0:d.querySelector(".settings-secret-hint");if(c&&c.remove(),!n.valid&&n.hint){const v=document.createElement("span");v.className="settings-secret-hint",v.textContent=n.hint,d==null||d.appendChild(v)}if(H(t.dataset.feature),i==="OLLAMA_API_URL"&&n.valid){const v=s.querySelector("select[data-model-select]");v&&K(v)}A()})}),s.querySelectorAll("a[data-signup-url]").forEach(t=>{t.addEventListener("click",i=>{i.preventDefault();const a=t.dataset.signupUrl;a&&(ue()?Y("open_url",{url:a}).catch(()=>window.open(a,"_blank")):window.open(a,"_blank"))})});const e=s.querySelector("select[data-model-select]");e&&(e.addEventListener("change",()=>{const t=e.value;t&&(g.setPending("OLLAMA_MODEL",t),g.setValidation("OLLAMA_MODEL",!0),e.classList.remove("invalid"),e.classList.add("valid-staged"),H("aiOllama"),A())}),K(e))}function H(s){const e=document.querySelector(`.settings-feat[data-feature-id="${s}"]`);if(!e)return;const t=E.find(c=>c.id===s);if(!t)return;const i=x(s),a=k(t),n=!i&&a.every(c=>M(c).valid||g.hasPending(c)&&g.getValidationState(c).validated!==!1),o=e.classList.contains("expanded");e.className=`settings-feat ${i?"ready":n?"staged":"needs"}${o?" expanded":""}`;const d=e.querySelector(".settings-feat-pill");d&&(d.className=`settings-feat-pill ${i?"ok":n?"staged":"warn"}`,d.textContent=i?"Ready":n?"Staged":"Needs keys")}async function K(s){var o,d,c;const e=T(),t=g.getPending("OLLAMA_API_URL")||((o=e.secrets.OLLAMA_API_URL)==null?void 0:o.value)||"";if(!t){s.innerHTML='<option value="" disabled selected>Set Ollama URL first</option>';return}const i=g.getPending("OLLAMA_MODEL")||((d=e.secrets.OLLAMA_MODEL)==null?void 0:d.value)||"",a=await pe(t);if(a.length===0){const l=(c=s.parentElement)==null?void 0:c.querySelector("input[data-model-manual]");l&&(s.style.display="none",l.classList.remove("hidden-input"),l.dataset.listenerAttached||(l.dataset.listenerAttached="1",l.addEventListener("blur",()=>{const v=l.value.trim();v&&(g.setPending("OLLAMA_MODEL",v),g.setValidation("OLLAMA_MODEL",!0),l.classList.remove("invalid"),l.classList.add("valid-staged"),H("aiOllama"),A())})));return}const n=i?"":'<option value="" selected disabled>Select a model...</option>';s.innerHTML=n+a.map(l=>`<option value="${u(l)}" ${l===i?"selected":""}>${u(l)}</option>`).join("")}function $e(s){var t,i,a,n;s.innerHTML=`
    <div class="settings-section-header">
      <h2>Debug &amp; Logs</h2>
    </div>
    <div class="debug-actions">
      <button id="openLogsBtn" type="button">Open Logs Folder</button>
      <button id="openSidecarLogBtn" type="button">Open API Log</button>
    </div>
    <section class="debug-data-section">
      <h3>Data Management</h3>
      <div class="debug-data-actions">
        <button type="button" class="settings-btn settings-btn-secondary" id="exportSettingsBtn">
          ${r("components.settings.exportSettings")}
        </button>
        <button type="button" class="settings-btn settings-btn-secondary" id="importSettingsBtn">
          ${r("components.settings.importSettings")}
        </button>
        <input type="file" id="importSettingsInput" accept=".json" style="display: none;" />
      </div>
    </section>
    <section class="settings-diagnostics" id="diagnosticsSection">
      <header class="diag-header">
        <h2>Diagnostics</h2>
        <div class="diag-toggles">
          <label><input type="checkbox" id="verboseApiLog"> Verbose Sidecar Log</label>
          <label><input type="checkbox" id="fetchDebugLog"> Frontend Fetch Debug</label>
        </div>
      </header>
      <div class="diag-traffic-bar">
        <h3>API Traffic <span id="trafficCount"></span></h3>
        <div class="diag-traffic-controls">
          <label><input type="checkbox" id="autoRefreshLog" checked> Auto</label>
          <button id="refreshLogBtn" type="button">Refresh</button>
          <button id="clearLogBtn" type="button">Clear</button>
        </div>
      </div>
      <div id="trafficLog" class="diag-traffic-log"></div>
    </section>
  `,(t=s.querySelector("#openLogsBtn"))==null||t.addEventListener("click",()=>{N("open_logs_folder",r("modals.settingsWindow.openLogs"))}),(i=s.querySelector("#openSidecarLogBtn"))==null||i.addEventListener("click",()=>{N("open_sidecar_log_file",r("modals.settingsWindow.openApiLog"))}),(a=s.querySelector("#exportSettingsBtn"))==null||a.addEventListener("click",()=>{ae()});const e=s.querySelector("#importSettingsInput");(n=s.querySelector("#importSettingsBtn"))==null||n.addEventListener("click",()=>{e==null||e.click()}),e==null||e.addEventListener("change",async o=>{var c;const d=(c=o.target.files)==null?void 0:c[0];if(d){try{const l=await ne(d);h(r("components.settings.importSuccess",{count:String(l.keysImported)}),"ok")}catch(l){l instanceof DOMException?l.name==="QuotaExceededError"||l.name==="NS_ERROR_DOM_QUOTA_REACHED"?h(r("components.settings.importFailed")+": storage limit reached","error"):l.name==="SecurityError"?h(r("components.settings.importFailed")+": storage blocked","error"):h(`${r("components.settings.importFailed")}: ${l.message||l.name}`,"error"):l instanceof Error&&l.message?h(`${r("components.settings.importFailed")}: ${l.message}`,"error"):h(r("components.settings.importFailed"),"error")}e.value=""}}),Se()}function Se(){const s=document.getElementById("verboseApiLog"),e=document.getElementById("fetchDebugLog"),t=document.getElementById("autoRefreshLog"),i=document.getElementById("refreshLogBtn"),a=document.getElementById("clearLogBtn"),n=document.getElementById("trafficLog"),o=document.getElementById("trafficCount");e&&(e.checked=localStorage.getItem("wm-debug-log")==="1",e.addEventListener("change",()=>{localStorage.setItem("wm-debug-log",e.checked?"1":"0")}));async function d(){if(s)try{const f=await(await I("/api/local-debug-toggle")).json();s.checked=f.verboseMode}catch{}}s==null||s.addEventListener("change",async()=>{try{const f=await(await I("/api/local-debug-toggle",{method:"POST"})).json();s&&(s.checked=f.verboseMode),h(f.verboseMode?r("modals.settingsWindow.verboseOn"):r("modals.settingsWindow.verboseOff"),"ok")}catch{h(r("modals.settingsWindow.sidecarError"),"error")}}),d();async function c(){if(n)try{const w=(await(await I("/api/local-traffic-log")).json()).entries||[];if(o&&(o.textContent=`(${w.length})`),w.length===0){n.innerHTML=`<p class="diag-empty">${r("modals.settingsWindow.noTraffic")}</p>`;return}const b=w.slice().reverse().map(y=>{var F;const S=((F=y.timestamp.split("T")[1])==null?void 0:F.replace("Z",""))||y.timestamp;return`<tr class="diag-${y.status<300?"ok":y.status<500?"warn":"err"}"><td>${u(S)}</td><td>${y.method}</td><td title="${u(y.path)}">${u(y.path)}</td><td>${y.status}</td><td>${y.durationMs}ms</td></tr>`}).join("");n.innerHTML=`<table class="diag-table"><thead><tr><th>${r("modals.settingsWindow.table.time")}</th><th>${r("modals.settingsWindow.table.method")}</th><th>${r("modals.settingsWindow.table.path")}</th><th>${r("modals.settingsWindow.table.status")}</th><th>${r("modals.settingsWindow.table.duration")}</th></tr></thead><tbody>${b}</tbody></table>`}catch{n.innerHTML=`<p class="diag-empty">${r("modals.settingsWindow.sidecarUnreachable")}</p>`}}i==null||i.addEventListener("click",()=>void c()),a==null||a.addEventListener("click",async()=>{try{await I("/api/local-traffic-log",{method:"DELETE"})}catch{}n&&(n.innerHTML=`<p class="diag-empty">${r("modals.settingsWindow.logCleared")}</p>`),o&&(o.textContent="(0)")});let l=null;function v(){p(),l=fe(()=>c(),{intervalMs:3e3,pauseWhenHidden:!0,refreshOnVisible:!0,runImmediately:!0,jitterFraction:0})}function p(){l&&(l.stop(),l=null)}t==null||t.addEventListener("change",()=>{t.checked?v():p()}),v(),P=p}function j(s,e){const t=u(s),i=u(e);if(!i)return t;const a=new RegExp(`(${i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");return t.replace(a,"<mark>$1</mark>")}function Ee(s){const e=document.getElementById("contentArea");if(!e)return;if(!s.trim()){O($);return}const t=s.toLowerCase(),i=[];for(const n of R)for(const o of n.features){const d=E.find(l=>l.id===o);if(!d)continue;[d.name,d.description,...k(d).map(l=>G[l]||l)].join(" ").toLowerCase().includes(t)&&i.push({feature:d,catLabel:n.label})}if(i.length===0){e.innerHTML=`<div class="settings-search-empty"><p>No features match "${u(s)}"</p></div>`;return}const a=i.map(({feature:n,catLabel:o})=>{const d=q(n.id),c=x(n.id),l=k(n),v=!c&&l.every(b=>M(b).valid||g.hasPending(b)&&g.getValidationState(b).validated!==!1),p=c?"ready":v?"staged":"needs",m=c?"ok":v?"staged":"warn",f=c?"Ready":v?"Staged":"Needs keys",w=l.map(b=>Z(b,n.id)).join("");return`
      <div class="settings-feat ${p} expanded" data-feature-id="${n.id}">
        <div class="settings-feat-header" data-feat-toggle-expand="${n.id}">
          <label class="settings-feat-toggle-label" data-click-stop>
            <div class="settings-feat-switch">
              <input type="checkbox" data-toggle="${n.id}" ${d?"checked":""} />
              <span class="settings-feat-slider"></span>
            </div>
          </label>
          <div class="settings-feat-info">
            <span class="settings-feat-name">${j(n.name,s)}</span>
            <span class="settings-feat-desc">${j(n.description,s)}</span>
          </div>
          <span class="settings-feat-pill ${m}">${f}</span>
          <span class="settings-feat-chevron">&#x25B8;</span>
        </div>
        <div class="settings-feat-body">
          <div class="settings-feat-cat-tag">${u(o)}</div>
          ${w}
        </div>
      </div>
    `}).join("");e.innerHTML=`
    <div class="settings-section-header">
      <h2>Search results for "${u(s)}"</h2>
    </div>
    <div class="settings-feat-list">${a}</div>
  `,J(e)}async function Me(){var t,i,a;await oe(),le(),se();try{await de()}catch{}requestAnimationFrame(()=>{document.documentElement.classList.remove("no-transition")}),await ce(),g=new me,O("overview"),(t=document.getElementById("sidebarNav"))==null||t.addEventListener("click",n=>{const o=n.target.closest("[data-section]");o!=null&&o.dataset.section&&O(o.dataset.section)});const s=document.getElementById("settingsSearch");let e;s==null||s.addEventListener("input",()=>{clearTimeout(e),e=setTimeout(()=>Ee(s.value),200)}),(i=document.getElementById("okBtn"))==null||i.addEventListener("click",()=>{(async()=>{try{const n=document.querySelector("[data-wm-key-input]"),o=n==null?void 0:n.value.trim(),d=!!(o&&o!==L&&o.length>0),c=document.getElementById("contentArea");c&&g.captureUnsavedInputs(c);const l=g.hasPendingChanges();if(!l&&!d){D();return}if(d&&o&&await U("WORLDMONITOR_API_KEY",o),l){h(r("modals.settingsWindow.validating"),"ok");const v=g.getMissingRequiredSecrets();if(v.length>0){h(`Missing required: ${v.join(", ")}`,"error");return}const p=await g.verifyPendingSecrets();if(p.length>0){h(r("modals.settingsWindow.verifyFailed",{errors:p.join(", ")}),"error");return}await g.commitVerifiedSecrets()}h(r("modals.settingsWindow.saved"),"ok"),D()}catch(n){console.error("[settings] save error:",n),h(r("modals.settingsWindow.failed",{error:String(n)}),"error")}})()}),(a=document.getElementById("cancelBtn"))==null||a.addEventListener("click",()=>{D()}),window.addEventListener("beforeunload",()=>{g.destroy()})}localStorage.setItem("wm-settings-open","1");window.addEventListener("beforeunload",()=>localStorage.removeItem("wm-settings-open"));Me();
