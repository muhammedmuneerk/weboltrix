import fs from 'node:fs';
import path from 'node:path';
export async function verifyNativeStates({page,cache}){
 const audit=fs.readFileSync('tests/theme-portability/audit.js','utf8'),project=audit.slice(audit.indexOf('function stateSheet('),audit.indexOf('async function load('));const pause=ms=>new Promise(r=>setTimeout(r,ms)),checks=[];
 await page.send('DOM.enable');await page.send('CSS.enable');
 for(const theme of ['baseline','original','navy','light']){await fetch('http://127.0.0.1:5183/__audit/theme',{method:'POST',body:JSON.stringify({theme})});
 for(const width of [1440,390]){await page.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
 for(const route of ['/','/contact']){await page.send('Page.navigate',{url:'http://127.0.0.1:5183'+route});for(let i=0;i<100;i++){if(await page.eval("document.readyState==='complete'&&!!document.querySelector('#root main')"))break;await pause(50)}await page.eval("document.fonts.ready.then(()=>true)");await pause(250);await page.eval(`(()=>{const s=document.createElement('style');s.textContent='*,*::before,*::after{transition:none!important;animation:none!important}';document.head.append(s)})()`);await page.eval(project+';stateSheet(document)');
 const selectors=['a.premium-button-light','a.premium-button-dark','[data-color-part="primary-action"]','[role="slider"]',width===1440?'#enquiry-name':'#m-enquiry-name','button[aria-pressed]'];
 for(const selector of selectors){const found=await page.eval(`(()=>{const e=[...document.querySelectorAll(${JSON.stringify(selector)})].find(e=>e.getBoundingClientRect().width&&e.getBoundingClientRect().height);if(!e)return null;e.setAttribute('data-native-probe','');return {className:e.className,group:!!e.closest('.group')}})()`);if(!found)continue;
 const root=(await page.send('DOM.getDocument')).root.nodeId,node=(await page.send('DOM.querySelector',{nodeId:root,selector:'[data-native-probe]'})).nodeId;
 const read=`(()=>{const e=document.querySelector('[data-native-probe]');return [e,...e.querySelectorAll('*')].map(n=>['','::before','::after'].map(p=>{const s=getComputedStyle(n,p||null);return ['color','backgroundColor','borderBottomColor','outlineColor','outlineStyle','outlineWidth','boxShadow','fill','stroke'].map(k=>s[k])}))})()`;
 for(const state of ['hover','active',...(found.className.includes('focus-visible:')||selector.includes('enquiry')?['focus-visible']:[])]){
 await page.send('CSS.forcePseudoState',{nodeId:node,forcedPseudoClasses:state==='focus-visible'?['focus','focus-visible']:[state]});const native=await page.eval(read);await page.send('CSS.forcePseudoState',{nodeId:node,forcedPseudoClasses:[]});
 await page.eval(`(()=>{const e=document.querySelector('[data-native-probe]');e.setAttribute('data-audit-${state}','');${state==='focus-visible'?"e.setAttribute('data-audit-focus','');":''}})()`);const projected=await page.eval(read);await page.eval(`(()=>{const e=document.querySelector('[data-native-probe]');e.removeAttribute('data-audit-${state}');e.removeAttribute('data-audit-focus')})()`);
 checks.push({theme,width,route,selector,state,pass:JSON.stringify(native)===JSON.stringify(projected),...(JSON.stringify(native)!==JSON.stringify(projected)?{native,projected}:{})});}
 await page.eval("document.querySelector('[data-native-probe]').removeAttribute('data-native-probe')");}
 }}}
 await fetch('http://127.0.0.1:5183/__audit/theme',{method:'POST',body:JSON.stringify({theme:'original'})});fs.writeFileSync(path.join(cache,'native-state-results.json'),JSON.stringify({checks,failures:checks.filter(x=>!x.pass).length},null,2));console.log(JSON.stringify({nativeChecks:checks.length,failures:checks.filter(x=>!x.pass).length,examples:checks.filter(x=>!x.pass).map(({native,projected,...x})=>x)},null,2));
}
