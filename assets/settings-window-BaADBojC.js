import{t as o,c5 as A,g3 as h,bY as u,b8 as f,b7 as k,S as E,b6 as y,i as L,e as r,ge as m,gJ as T,gk as C,bX as P}from"./panels-DEs91TFQ.js";import"./deck-stack-DIH23tjw.js";import"./sentry-C2sjIlLb.js";import"./d3-A6Y4oGMQ.js";import"./i18n-qlunRAMb.js";function _(a,e){if(a==="runtime-config")return o("modals.runtimeConfig.title");const l=`panels.${a.replace(/-([a-z])/g,(p,d)=>d.toUpperCase())}`,c=o(l);return c===l?e:c}function R(){var d;const a=document.getElementById("app");if(!a)return;document.title=`${o("header.settings")} - StockMonitor App`;const e=A(u.panels,h),b=new Set(Object.keys(f));for(const t of Object.keys(e))!b.has(t)&&t!=="runtime-config"&&delete e[t];const l=new Set(k[E]??[]);for(const t of Object.keys(f))t in e||(e[t]={...y(t,E),enabled:l.has(t)});const c=L();function p(){const v=Object.entries(e).filter(([n])=>(n!=="runtime-config"||c)&&(!n.startsWith("cw-")||m())).map(([n,s])=>`
        <div class="panel-toggle-item ${s.enabled?"active":""}" data-panel="${r(n)}">
          <div class="panel-toggle-checkbox">${s.enabled?"✓":""}</div>
          <span class="panel-toggle-label">${r(_(n,s.name))}</span>
        </div>
      `).join(""),g=document.getElementById("panelToggles");g&&(g.innerHTML=v,g.querySelectorAll(".panel-toggle-item").forEach(n=>{n.addEventListener("click",()=>{const s=n.dataset.panel,i=e[s];if(i){if(!i.enabled&&T(s,f[s]??i,m()),!i.enabled&&!m()&&Object.entries(e).filter(([w,S])=>S.enabled&&!w.startsWith("cw-")).length>=C)return;i.enabled=!i.enabled,P(u.panels,e),p()}})}))}a.innerHTML=`
    <div class="settings-window-shell">
      <div class="settings-window-header">
        <div class="settings-window-header-text">
          <span class="settings-window-title">${r(o("header.settings"))}</span>
          <p class="settings-window-caption">${r(o("header.panelDisplayCaption"))}</p>
        </div>
        <button type="button" class="modal-close" id="settingsWindowClose">×</button>
      </div>
      <div class="panel-toggle-grid" id="panelToggles"></div>
    </div>
  `,(d=document.getElementById("settingsWindowClose"))==null||d.addEventListener("click",()=>{window.close()}),p()}export{R as initSettingsWindow};
