// Test-only DOM inspector; never imported by the production application.
const frame=document.querySelector('#site'),status=document.querySelector('#status');
const config=await fetch('/__audit/config').then(r=>r.json());let stopped=false;
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const props=['color','backgroundColor','backgroundImage','borderTopColor','borderRightColor','borderBottomColor','borderLeftColor','outlineColor','boxShadow','textShadow','fill','stroke','webkitTextStrokeColor','maskImage','filter'];
props.push('display','position','width','height','paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginRight','marginBottom','marginLeft','fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','borderTopWidth','borderRadius','gap','gridTemplateColumns','flexDirection','opacity','transitionProperty');
const color=s=>{const n=s?.match(/[\d.]+/g)?.map(Number);return n?.length>=3?[...n.slice(0,3),n[3]??1]:[0,0,0,0]};
const over=(a,b)=>a.slice(0,3).map((v,i)=>v*a[3]+b[i]*(1-a[3]));
const luminance=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
const ratio=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
function label(e){return e.id?'#'+e.id:e.getAttribute('data-color-scope')?'[scope='+e.getAttribute('data-color-scope')+']':e.tagName.toLowerCase()+'.'+[...e.classList].slice(0,3).join('.')}
function pathFor(e){let result=[];for(let n=e;n&&result.length<4;n=n.parentElement){result.unshift(label(n));if(n.hasAttribute('data-color-scope'))break}return result.join(' > ')}
function visible(e){const r=e.getBoundingClientRect();if(!r.width||!r.height)return false;for(let n=e;n;n=n.parentElement){const s=n.ownerDocument.defaultView.getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden'||+s.opacity<.05||n.getAttribute('aria-hidden')==='true')return false;if(n!==e&&['hidden','clip'].includes(s.overflowY)){const p=n.getBoundingClientRect();if(r.bottom<=p.top||r.top>=p.bottom||!p.height)return false}}return true}
function backgrounds(e){let chain=[],opacity=1,hasImage=false;for(let n=e;n;n=n.parentElement)chain.unshift(n);let candidates=[[255,255,255]];
 const rect=e.getBoundingClientRect(),cx=(rect.left+rect.right)/2,cy=(rect.top+rect.bottom)/2;
 function paint(n){const s=n.ownerDocument.defaultView.getComputedStyle(n),bg=color(s.backgroundColor);if(bg[3])candidates=candidates.map(c=>over(bg,c));
  // CSS backgrounds paint rightmost first. Do not treat transparent radial
  // stops as holes through the opaque final linear-gradient layer.
  const layers=s.backgroundImage.match(/(?:[^,(]+\((?:[^()]|\([^()]*\))*\))/g)||[];
  for(const layer of layers.reverse()){const stops=[...layer.matchAll(/rgba?\([^)]+\)/g)].map(m=>color(m[0]));if(stops.length)candidates=candidates.flatMap(c=>stops.map(stop=>over(stop,c))).slice(0,64);else if(layer.includes('url('))hasImage=true;}
 }
 for(const n of chain){
  // Sliding selection thumbs and image scrims are positioned sibling layers.
  for(let p=n.previousElementSibling;p;p=p.previousElementSibling){const ps=p.ownerDocument.defaultView.getComputedStyle(p),r=p.getBoundingClientRect();if(ps.position==='absolute'&&!p.textContent.trim()&&r.left<=cx&&r.right>=cx&&r.top<=cy&&r.bottom>=cy&&+ps.opacity>.99)paint(p);}
  const s=n.ownerDocument.defaultView.getComputedStyle(n);opacity*=+s.opacity;paint(n);
 }
 // Image-backed content needs a separate conservative uncertainty classification.
 const er=e.getBoundingClientRect();let media=e.closest('[data-color-context="media"]');
 if(!media){for(let n=e.parentElement;n&&n.tagName!=='SECTION';n=n.parentElement)if([...n.children].some(c=>c.tagName==='IMG')){media=n;break}}
 if(media&&media.querySelector('img'))hasImage=true;
 return {candidates,opacity,hasImage};
}
function inspectText(doc,root=doc.body,state='normal'){
 const w=doc.defaultView,walker=doc.createTreeWalker(root,NodeFilter.SHOW_TEXT),results=[];let n;
 while(n=walker.nextNode()){const text=n.textContent.trim(),e=n.parentElement;if(!text||!e||['STYLE','SCRIPT','OPTION'].includes(e.tagName)||!visible(e))continue;
  const s=w.getComputedStyle(e),fg=color(s.color);if(fg[3]===0)continue;const {candidates,opacity,hasImage}=backgrounds(e);let lowest=Infinity,bg;
  for(const c of candidates){const rendered=over([...(over(fg,c)),opacity],c),r=ratio(rendered,c);if(r<lowest){lowest=r;bg=c;}}
  const threshold=parseFloat(s.fontSize)>=24||parseFloat(s.fontSize)>=18.66&&parseFloat(s.fontWeight)>=700?3:4.5;
  const disabled=!!e.closest(':disabled,[aria-disabled="true"]');results.push({text:text.slice(0,100),selector:pathFor(e),state,ratio:+lowest.toFixed(3),threshold,foreground:s.color,background:bg?.map(Math.round),opacity:+opacity.toFixed(3),image:hasImage,disabled,pass:disabled||lowest+.005>=threshold});
 }
 return results;
}
function snapshot(doc){return [...doc.querySelectorAll('body,#root *')].filter(e=>!['SCRIPT','STYLE'].includes(e.tagName)).map(e=>({tag:e.tagName,selector:pathFor(e),className:typeof e.className==='string'?e.className:'',bounds:{x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height},inlineStyle:e.getAttribute('style'),text:[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim().slice(0,80),visible:visible(e),style:['','::before','::after'].map(p=>{const s=doc.defaultView.getComputedStyle(e,p||null);return props.map(k=>s[k])})}));}
function stateSheet(doc){let out='';function visit(rules,media=''){for(const r of rules){if(r.cssRules&&!r.selectorText){if(r.conditionText&&r.constructor.name.includes('Media')){out+=`@media ${r.conditionText}{`;visit(r.cssRules);out+='}'}else if(!r.constructor.name.includes('Keyframes'))visit(r.cssRules);continue}if(r.selectorText&&/:(hover|active|focus)/.test(r.selectorText)){let sel=r.selectorText.replace(/:(hover|active|focus-visible|focus-within|focus)(?![\w-])/g,(_,n)=>`[data-audit-${n}]`);out+=sel+'{'+r.style.cssText+'}';}}}
 for(const sheet of doc.styleSheets)try{visit(sheet.cssRules)}catch{}
 const el=doc.createElement('style');el.dataset.audit='states';el.textContent=out;doc.head.append(el);return el.sheet.cssRules.length;
}
async function load(route,width,freeze=true){frame.width=width;await new Promise((resolve,reject)=>{frame.onload=resolve;frame.onerror=reject;frame.src=route+'?theme-audit='+Date.now()});const doc=frame.contentDocument;for(let i=0;i<100&&!doc.querySelector('#root main');i++)await pause(25);await doc.fonts.ready;await pause(500);
 if(freeze){const style=doc.createElement('style');style.textContent='*,*::before,*::after{transition-duration:0s!important;animation-duration:0s!important;animation-delay:0s!important;scroll-behavior:auto!important}';doc.head.append(style);}
 return doc;
}
function normalizeGradient(v){return v?.replace(/(rgb\([^()]+\)) 0%(?=,|\))/g,'$1').replace(/(rgb\([^()]+\)) 100%(?=\))/g,'$1')}
function overrideProbes(doc){
 const css=e=>doc.defaultView.getComputedStyle(e),hero=doc.querySelector('[data-color-scope="home-hero"]'),footer=doc.querySelector('[data-color-scope="footer"]'),action=doc.querySelector('[data-color-part="primary-action"]');
 const base={body:css(doc.body).backgroundColor,footer:css(footer).backgroundColor,hero:css(hero).backgroundImage,action:css(action).backgroundColor};
 const rootStyle=doc.documentElement.getAttribute('style');doc.documentElement.style.setProperty('--rgb-neutral-005','38, 38, 38');
 const global={pass:css(doc.body).backgroundColor!==base.body&&css(footer).backgroundColor===base.footer,before:base.body,after:css(doc.body).backgroundColor};
 if(rootStyle===null)doc.documentElement.removeAttribute('style');else doc.documentElement.setAttribute('style',rootStyle);
 const heroStyle=hero.getAttribute('style');hero.style.setProperty('--canvas-rgb','var(--rgb-neutral-048)');
 const scoped={pass:css(hero).backgroundImage!==base.hero&&css(doc.body).backgroundColor===base.body&&css(footer).backgroundColor===base.footer};
 if(heroStyle===null)hero.removeAttribute('style');else hero.setAttribute('style',heroStyle);
 const actionStyle=action.getAttribute('style');action.style.setProperty('--cta-primary-surface','rgb(var(--rgb-neutral-038))');
 const targeted={pass:css(action).backgroundColor!==base.action&&css(hero).backgroundImage===base.hero&&css(footer).backgroundColor===base.footer,before:base.action,after:css(action).backgroundColor};
 if(actionStyle===null)action.removeAttribute('style');else action.setAttribute('style',actionStyle);
 return {global,scoped,targeted,restored:css(doc.body).backgroundColor===base.body&&css(hero).backgroundImage===base.hero&&css(action).backgroundColor===base.action};
}
function compare(a,b){let differences=[];if(a.length!==b.length)return[{nodeCount:[a.length,b.length]}];for(let i=0;i<a.length;i++)for(let p=0;p<3;p++)for(let k=0;k<props.length;k++)if(normalizeGradient(a[i].style[p][k])!==normalizeGradient(b[i].style[p][k]))differences.push({node:i,tag:b[i].tag,text:b[i].text,visible:b[i].visible,pseudo:p,property:props[k],selector:b[i].selector,beforeBounds:a[i].bounds,afterBounds:b[i].bounds,beforeInlineStyle:a[i].inlineStyle,afterInlineStyle:b[i].inlineStyle,before:a[i].style[p][k],after:b[i].style[p][k]});return differences;}
async function interactions(doc){const records=[],controlChecks=[],visualStates=[];const projectedRules=stateSheet(doc);if(!projectedRules)throw Error('No interaction rules projected');const controls=[...doc.querySelectorAll('button,a,input,textarea,[role="slider"],summary')].filter(visible);let counts={hover:0,active:0,focus:0,disabled:0,selected:0};
 for(const state of ['hover','active','focus-visible'])for(const el of controls){if(el.disabled){counts.disabled++;continue}el.setAttribute('data-audit-'+state,'');let group=el.closest('.group');if(group&&state==='hover')group.setAttribute('data-audit-hover','');if(state==='focus-visible')el.setAttribute('data-audit-focus','');records.push(...inspectText(doc,el,state));visualStates.push({state,index:controls.indexOf(el),colors:[el,...el.querySelectorAll('*')].map(n=>['','::before','::after'].map(p=>{const cs=doc.defaultView.getComputedStyle(n,p||null);return props.slice(0,15).map(k=>normalizeGradient(cs[k]))}))});
 if(state==='focus-visible'&&el.hasAttribute('placeholder')){const pc=doc.defaultView.getComputedStyle(el,'::placeholder'),bg=backgrounds(el),fg=color(pc.color);const value=Math.min(...bg.candidates.map(c=>ratio(over(fg,c),c)));controlChecks.push({selector:pathFor(el),kind:'placeholder',ratio:+value.toFixed(3),threshold:4.5,pass:value>=4.5});}
 if(state==='focus-visible'){const cs=doc.defaultView.getComputedStyle(el);let edge;if(cs.outlineStyle!=='none'&&parseFloat(cs.outlineWidth)>0&&color(cs.outlineColor)[3]>0)edge={kind:'focus-outline',value:cs.outlineColor,behind:parseFloat(cs.outlineOffset)<0?el:el.parentElement};else if(el.className.includes('focus-visible:ring-2'))edge={kind:'focus-ring',value:[...cs.boxShadow.matchAll(/rgba?\([^)]+\)/g)][1]?.[0],behind:el.parentElement};else if(['INPUT','TEXTAREA'].includes(el.tagName)&&parseFloat(cs.borderBottomWidth)>0)edge={kind:'control-border',value:cs.borderBottomColor,behind:el.parentElement};if(edge){const bg=backgrounds(edge.behind),fg=color(edge.value);const value=Math.min(...bg.candidates.map(c=>ratio(over(fg,c),c)));controlChecks.push({selector:pathFor(el),kind:edge.kind,ratio:+value.toFixed(3),threshold:3,pass:value>=3});}}
 el.removeAttribute('data-audit-'+state);el.removeAttribute('data-audit-focus');if(group)group.removeAttribute('data-audit-hover');counts[state==='focus-visible'?'focus':state]++;}
 // Real local React selections only. No submit or external navigation.
 const safe=[...doc.querySelectorAll('button[role="tab"],button[aria-pressed],button[aria-expanded],button[aria-label="Next audience"],button[aria-label="Toggle navigation"]')].filter(e=>visible(e)&&!e.disabled).slice(0,35);
 for(const e of safe){e.click();await pause(15);counts.selected++;records.push(...inspectText(doc,e.closest('section')||e.parentElement,'selected'));}
 return {counts,records,controlChecks,visualStates,projectedRules};
}
async function run(quick=false){stopped=false;const baseline=new Map(),baselineStates=new Map(),report={started:new Date().toISOString(),method:'Computed DOM colors; conservative gradient-stop contrast; CSS-state projection plus real local selections; no form submission.',matrix:[],states:[],stateRegressions:[],regressions:[],themes:{}};
 for(const theme of config.themes){await fetch('/__audit/theme',{method:'POST',body:JSON.stringify({theme})});report.themes[theme]={textChecks:0,failures:[],uncertainImages:0,disabled:0};for(const width of config.widths)for(const route of quick?config.routes.slice(0,6):config.routes){if(stopped)break;status.textContent=`Running ${theme} ${width}px ${route} — ${report.matrix.length} route samples complete`;const doc=await load(route,width),key=width+route,snap=snapshot(doc);if(theme==='baseline')baseline.set(key,snap);if(theme==='original'){const diffs=compare(baseline.get(key),snap);if(diffs.length)report.regressions.push({width,route,differences:diffs});}
 const texts=inspectText(doc),stats=report.themes[theme];stats.textChecks+=texts.length;stats.disabled+=texts.filter(t=>t.disabled).length;stats.uncertainImages+=texts.filter(t=>t.image).length;const failures=texts.filter(t=>!t.pass);stats.failures.push(...failures.map(f=>({...f,width,route})));report.matrix.push({theme,width,route,nodes:snap.length,texts:texts.length,failures:failures.length,images:texts.filter(t=>t.image).length});
 {const exercised=await interactions(doc);if(theme==='baseline')baselineStates.set(key,exercised.visualStates);if(theme==='original'&&JSON.stringify(baselineStates.get(key))!==JSON.stringify(exercised.visualStates))report.stateRegressions.push({width,route});report.states.push({theme,width,route,projectedRules:exercised.projectedRules,counts:exercised.counts,checks:exercised.records.length,controlChecks:exercised.controlChecks,failures:exercised.records.filter(x=>!x.pass).map(x=>({...x,width,route}))});}
 await fetch('/__audit/results',{method:'POST',body:JSON.stringify(report)});
 }if(stopped)break;}
 // Preserve the first observation and retry discrepancies after extra settling.
 // This makes initialization timing visible rather than silently discarding it.
 report.initialRegressions=report.regressions;report.regressions=[];
 for(const item of report.initialRegressions){const snaps=[];for(const theme of ['baseline','original']){await fetch('/__audit/theme',{method:'POST',body:JSON.stringify({theme})});const doc=await load(item.route,item.width);await pause(1500);snaps.push(snapshot(doc));}const differences=compare(...snaps);if(differences.length)report.regressions.push({...item,differences});}
 await fetch('/__audit/theme',{method:'POST',body:JSON.stringify({theme:'original'})});report.overrideProbes=overrideProbes(await load('/',1440));
 report.finished=new Date().toISOString();await fetch('/__audit/results',{method:'POST',body:JSON.stringify(report)});window.auditReport=report;status.textContent=JSON.stringify({done:!stopped,routes:report.matrix.length,originalRegressionRoutes:report.regressions.length,themes:Object.fromEntries(Object.entries(report.themes).map(([k,v])=>[k,{checks:v.textChecks,failures:v.failures.length,imageChecks:v.uncertainImages}])),stateChecks:report.states.length,overrideProbes:report.overrideProbes},null,2);
}
document.querySelector('#run').onclick=()=>run().catch(e=>status.textContent=e.stack);
document.querySelector('#quick').onclick=()=>run(true).catch(e=>status.textContent=e.stack);
document.querySelector('#stop').onclick=()=>stopped=true;
document.querySelector('#preview').onclick=async()=>{await fetch('/__audit/theme',{method:'POST',body:JSON.stringify({theme:document.querySelector('#theme').value})});await load(document.querySelector('#route').value,1440,false);status.textContent='Preview loaded';};
