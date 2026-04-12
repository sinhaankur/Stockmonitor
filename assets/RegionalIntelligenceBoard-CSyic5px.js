var y=Object.defineProperty;var $=(t,e,r)=>e in t?y(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var p=(t,e,r)=>$(t,typeof e!="symbol"?e+"":e,r);import{e as o,gO as w,aB as g,aC as z,bz as S,a6 as k}from"./panels-7a5dUcyv.js";import"./deck-stack-DGMK1c2g.js";import"./sentry-C2sjIlLb.js";import"./d3-A6Y4oGMQ.js";import"./i18n-qlunRAMb.js";const B=[{id:"mena",label:"Middle East & North Africa"},{id:"east-asia",label:"East Asia & Pacific"},{id:"europe",label:"Europe & Central Asia"},{id:"north-america",label:"North America"},{id:"south-asia",label:"South Asia"},{id:"latam",label:"Latin America & Caribbean"},{id:"sub-saharan-africa",label:"Sub-Saharan Africa"}],f="mena";function h(t,e){return t===e}function C(t){var e,r;return[R(t.narrative),A(t),L(t.balance),M(t.actors),N(t.scenarioSets),I(t.transmissionPaths),j(((e=t.triggers)==null?void 0:e.active)??[],((r=t.narrative)==null?void 0:r.watchItems)??[]),T(t)].join("")}function d(t,e,r=""){return`
    <div class="rib-section" style="margin-bottom:12px;padding:10px 12px;border:1px solid var(--border);border-radius:4px;background:rgba(255,255,255,0.02);${r}">
      <div class="rib-section-title" style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-dim);margin-bottom:8px">${o(t)}</div>
      ${e}
    </div>
  `}function m(t,e){const r=((e==null?void 0:e.text)??"").trim();if(!r)return"";const i=((e==null?void 0:e.evidenceIds)??[]).filter(a=>a.length>0),n=i.length>0?`<span style="font-size:10px;color:var(--text-dim);margin-left:6px">[${o(i.slice(0,4).join(", "))}]</span>`:"";return`
    <div class="rib-narrative-row" style="margin-bottom:8px">
      <div style="font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-dim);margin-bottom:2px">${o(t)}${n}</div>
      <div style="font-size:12px;line-height:1.5">${o(r)}</div>
    </div>
  `}function R(t){if(!t)return"";const e=[m("Situation",t.situation),m("Balance Assessment",t.balanceAssessment),m("Outlook — 24h",t.outlook24h),m("Outlook — 7d",t.outlook7d),m("Outlook — 30d",t.outlook30d)].join("");return e?d("Narrative",e):""}function A(t){const e=t.regime,r=(e==null?void 0:e.label)??"unknown",i=(e==null?void 0:e.previousLabel)??"",n=(e==null?void 0:e.transitionDriver)??"",s=i&&i!==r?`<div style="font-size:11px;color:var(--text-dim);margin-top:2px">Was: ${o(i)}${n?` · ${o(n)}`:""}</div>`:"",l=`
    <div class="rib-regime-label" style="font-size:15px;font-weight:600;text-transform:capitalize">${o(r.replace(/_/g," "))}</div>
    ${s}
  `;return d("Regime",l)}function v(t,e,r){const i=Math.max(0,Math.min(1,e))*100;return`
    <div style="display:grid;grid-template-columns:110px 40px 1fr;gap:8px;align-items:center;margin-bottom:4px">
      <div style="font-size:11px;color:var(--text-dim)">${o(t)}</div>
      <div style="font-size:11px;font-variant-numeric:tabular-nums">${e.toFixed(2)}</div>
      <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${i.toFixed(1)}%;background:var(${r})"></div>
      </div>
    </div>
  `}function L(t){if(!t)return d("Balance Vector",'<div style="font-size:11px;color:var(--text-dim)">Unavailable</div>');const e=[v("Coercive",t.coercivePressure,"--danger"),v("Fragility",t.domesticFragility,"--danger"),v("Capital",t.capitalStress,"--danger"),v("Energy Vuln",t.energyVulnerability,"--danger")].join(""),r=[v("Alliance",t.allianceCohesion,"--accent"),v("Maritime",t.maritimeAccess,"--accent"),v("Energy Lev",t.energyLeverage,"--accent")].join(""),i=t.netBalance,n=Math.max(-1,Math.min(1,i)),a=Math.abs(n)*50,s=n>=0?"right":"left",l=n>=0?"var(--accent)":"var(--danger)",x=`
    <div style="display:grid;grid-template-columns:110px 40px 1fr;gap:8px;align-items:center;margin-top:6px;padding-top:6px;border-top:1px dashed rgba(255,255,255,0.1)">
      <div style="font-size:11px;color:var(--text-dim);font-weight:600">Net Balance</div>
      <div style="font-size:11px;font-variant-numeric:tabular-nums;font-weight:600">${i.toFixed(2)}</div>
      <div style="position:relative;height:6px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden">
        <div style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(255,255,255,0.3)"></div>
        <div style="position:absolute;${s}:50%;top:0;bottom:0;width:${a.toFixed(1)}%;background:${l}"></div>
      </div>
    </div>
  `,c=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div>
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;margin-bottom:4px">Pressures</div>
        ${e}
      </div>
      <div>
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;margin-bottom:4px">Buffers</div>
        ${r}
      </div>
    </div>
    ${x}
  `;return d("Balance Vector",c)}function M(t){if(!t||t.length===0)return d("Actors",'<div style="font-size:11px;color:var(--text-dim)">No actor data</div>');const r=[...t].sort((i,n)=>(n.leverageScore??0)-(i.leverageScore??0)).slice(0,5).map(i=>{const n=i.delta>0?`+${i.delta.toFixed(2)}`:i.delta.toFixed(2),a=i.delta>0?"var(--danger)":i.delta<0?"var(--accent)":"var(--text-dim)",s=(i.leverageDomains??[]).slice(0,3).join(", ");return`
      <div style="display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center;padding:4px 0;border-bottom:1px dashed rgba(255,255,255,0.06)">
        <div>
          <div style="font-size:12px;font-weight:500">${o(i.name||i.actorId)}</div>
          <div style="font-size:10px;color:var(--text-dim);text-transform:capitalize">${o(i.role||"actor")}${s?` · ${o(s)}`:""}</div>
        </div>
        <div style="font-size:11px;font-variant-numeric:tabular-nums">${(i.leverageScore??0).toFixed(2)}</div>
        <div style="font-size:10px;color:${a};font-variant-numeric:tabular-nums;min-width:38px;text-align:right">${o(n)}</div>
      </div>
    `}).join("");return d("Actors",r)}function N(t){if(!t||t.length===0)return d("Scenarios",'<div style="font-size:11px;color:var(--text-dim)">No scenario data</div>');const e={"24h":0,"7d":1,"30d":2},r=[...t].sort((s,l)=>(e[s.horizon]??99)-(e[l.horizon]??99)),i={base:"var(--text-dim)",escalation:"var(--danger)",containment:"var(--accent)",fragmentation:"var(--warning, #e0a020)"},n=r.map(s=>{const x=[...s.lanes??[]].sort((c,u)=>u.probability-c.probability).map(c=>{const u=Math.round((c.probability??0)*100),b=i[c.name]??"var(--text-dim)";return`
        <div style="margin-bottom:3px">
          <div style="display:flex;justify-content:space-between;font-size:11px;text-transform:capitalize">
            <span>${o(c.name)}</span>
            <span style="font-variant-numeric:tabular-nums">${u}%</span>
          </div>
          <div style="height:4px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden">
            <div style="height:100%;width:${u}%;background:${b}"></div>
          </div>
        </div>
      `}).join("");return`
      <div>
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;margin-bottom:6px">${o(s.horizon)}</div>
        ${x}
      </div>
    `}).join(""),a=`<div style="display:grid;grid-template-columns:repeat(${r.length},1fr);gap:12px">${n}</div>`;return d("Scenarios",a)}function E(t){switch((t??"").toLowerCase()){case"critical":return"var(--danger)";case"high":return"var(--danger)";case"medium":return"var(--warning, #e0a020)";case"low":return"var(--text-dim)";default:return"var(--text-dim)"}}function I(t){if(!t||t.length===0)return d("Transmission Paths",'<div style="font-size:11px;color:var(--text-dim)">No active transmissions</div>');const r=[...t].sort((i,n)=>(n.confidence??0)-(i.confidence??0)).slice(0,5).map(i=>{const n=E(i.severity),a=i.corridorId?` via ${o(i.corridorId)}`:"",s=Math.round((i.confidence??0)*100),l=i.latencyHours>0?` · ${i.latencyHours}h`:"";return`
      <div style="padding:4px 0;border-bottom:1px dashed rgba(255,255,255,0.06);display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center">
        <div>
          <div style="font-size:11px;font-weight:500">${o(i.mechanism||"mechanism")}${a}</div>
          <div style="font-size:10px;color:var(--text-dim)">${o(i.start||"")} → ${o(i.end||"")}${l}</div>
        </div>
        <div style="font-size:10px;font-variant-numeric:tabular-nums;color:${n};text-transform:uppercase">${o(i.severity||"unspec")} · ${s}%</div>
      </div>
    `}).join("");return d("Transmission Paths",r)}function j(t,e){const r=(t??[]).map(a=>`
    <div style="padding:3px 0;font-size:11px">
      <span style="color:var(--danger);font-weight:600">●</span>
      ${o(a.id)}${a.description?` — <span style="color:var(--text-dim)">${o(a.description)}</span>`:""}
    </div>
  `).join(""),i=(e??[]).filter(a=>(a.text??"").trim().length>0).map(a=>`
    <div style="padding:3px 0;font-size:11px">
      <span style="color:var(--text-dim)">▸</span>
      ${o(a.text)}
    </div>
  `).join("");if(!r&&!i)return d("Watchlist",'<div style="font-size:11px;color:var(--text-dim)">No active triggers or watch items</div>');const n=[];return r&&n.push(`<div style="margin-bottom:6px"><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;margin-bottom:2px">Active Triggers</div>${r}</div>`),i&&n.push(`<div><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;margin-bottom:2px">Watch Items</div>${i}</div>`),d("Watchlist",n.join(""))}function T(t){const e=t.meta;if(!e)return"";const r=Math.round((e.snapshotConfidence??0)*100),i=t.generatedAt?`${new Date(t.generatedAt).toISOString().replace("T"," ").slice(0,16)}Z`:"—",n=e.narrativeProvider?`${o(e.narrativeProvider)}/${o(e.narrativeModel||"unknown")}`:"no narrative";return`
    <div style="display:flex;flex-wrap:wrap;gap:12px;padding:6px 2px 0;font-size:10px;color:var(--text-dim)">
      <span>generated ${o(i)}</span>
      <span>confidence ${r}%</span>
      <span>scoring v${o(e.scoringVersion||"")}</span>
      <span>geo v${o(e.geographyVersion||"")}</span>
      <span>narrative: ${n}</span>
    </div>
  `}const F=new S(k(),{fetch:(...t)=>globalThis.fetch(...t)});class W extends w{constructor(){super({id:"regional-intelligence",title:"Regional Intelligence",infoTooltip:"Canonical regional intelligence brief: regime label, 7-axis balance vector, top actors, scenario lanes, transmission paths, and watchlist. One snapshot per region, refreshed every 6 hours.",premium:"locked"});p(this,"selector");p(this,"body");p(this,"currentRegion",f);p(this,"latestSequence",0);this.selector=g("select",{className:"rib-region-selector","aria-label":"Region"});for(const i of B){const n=document.createElement("option");n.value=i.id,n.textContent=i.label,i.id===f&&(n.selected=!0),this.selector.appendChild(n)}this.selector.addEventListener("change",()=>{this.currentRegion=this.selector.value,this.loadCurrent()});const r=g("div",{className:"rib-controls"},this.selector);this.body=g("div",{className:"rib-body"}),z(this.content,g("div",{className:"rib-shell"},r,this.body)),this.renderLoading(),this.loadCurrent()}async loadRegion(r){this.currentRegion=r,this.selector.value=r,await this.loadCurrent()}async loadCurrent(){this.latestSequence+=1;const r=this.latestSequence,i=this.currentRegion;this.renderLoading();try{const n=await F.getRegionalSnapshot({regionId:i});if(!h(r,this.latestSequence))return;const a=n.snapshot;if(!(a!=null&&a.regionId)){this.renderEmpty();return}this.renderBoard(a)}catch(n){if(!h(r,this.latestSequence))return;console.error("[RegionalIntelligenceBoard] load failed",n),this.renderError(n instanceof Error?n.message:String(n))}}renderLoading(){this.body.innerHTML='<div class="rib-status" style="padding:16px;color:var(--text-dim);font-size:12px">Loading regional snapshot…</div>'}renderEmpty(){this.body.innerHTML='<div class="rib-status" style="padding:16px;color:var(--text-dim);font-size:12px">No snapshot available yet for this region. The next cron cycle will populate it within 6 hours.</div>'}renderError(r){this.body.innerHTML=`<div class="rib-status rib-status-error" style="padding:16px;color:var(--danger);font-size:12px">Failed to load snapshot: ${o(r)}</div>`}renderBoard(r){this.body.innerHTML=C(r)}}export{W as RegionalIntelligenceBoard};
