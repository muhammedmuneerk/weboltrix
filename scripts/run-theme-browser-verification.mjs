// Run the existing browser audit in an isolated installed-Chrome profile.
// No production source/theme mutations; the already-built bundles are reused.
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {captureEvidence} from '../tests/theme-portability/capture.mjs';
import {verifyNativeStates} from '../tests/theme-portability/native-states.mjs';
const root=process.cwd(),cache=path.join(root,'.cache/theme-portability'),profile=fs.mkdtempSync(path.join(cache,'chrome-verification-profile-'));
fs.mkdirSync(profile,{recursive:true});
const chrome=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-background-networking','--remote-debugging-port=0',`--user-data-dir=${profile}`,'--window-size=1600,1100','--force-device-scale-factor=1','about:blank'],{stdio:'ignore',windowsHide:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
class CDP{constructor(ws){this.ws=ws;this.id=0;this.pending=new Map();ws.addEventListener('message',e=>{const m=JSON.parse(e.data),p=this.pending.get(m.id);if(p){this.pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result)}})}async send(method,params={}){return new Promise((resolve,reject)=>{const id=++this.id;const timer=setTimeout(()=>{this.pending.delete(id);reject(Error('CDP timeout: '+method))},30000);this.pending.set(id,{resolve:v=>{clearTimeout(timer);resolve(v)},reject:e=>{clearTimeout(timer);reject(e)}});this.ws.send(JSON.stringify({id,method,params}));})}static async connect(url){const ws=new WebSocket(url);await new Promise((r,j)=>{ws.addEventListener('open',r,{once:true});ws.addEventListener('error',j,{once:true})});return new CDP(ws)}async eval(expression){const r=await this.send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value}}
let browser,page;
try{
 const portFile=path.join(profile,'DevToolsActivePort');for(let i=0;i<200&&!fs.existsSync(portFile);i++)await sleep(100);const[port,browserPath]=fs.readFileSync(portFile,'utf8').trim().split(/\r?\n/);
 browser=await CDP.connect(`ws://127.0.0.1:${port}${browserPath}`);const{targetId}=await browser.send('Target.createTarget',{url:'http://127.0.0.1:5183/__audit'});let target;for(let i=0;i<50&&!target;i++){target=(await fetch(`http://127.0.0.1:${port}/json/list`).then(r=>r.json())).find(t=>t.id===targetId);if(!target)await sleep(100)}page=await CDP.connect(target.webSocketDebuggerUrl);await page.send('Page.enable');await page.send('Runtime.enable');
 for(let i=0;i<100;i++){if(await page.eval("!!document.querySelector('#run')?.onclick"))break;await sleep(100)}
 if(process.argv.includes('--states-only')){await verifyNativeStates({page,cache});}else if(process.argv.includes('--capture-only')){await captureEvidence({page,cache});}else{
 const started=Date.now();await page.eval("document.querySelector('#run').click()");let last=-1,report;
 while(Date.now()-started<1200000){await sleep(2000);try{report=JSON.parse(fs.readFileSync(path.join(cache,'browser-results.json')))}catch{continue}if(Date.parse(report.started)<started-2000)continue;if(report.matrix.length!==last){last=report.matrix.length;console.log(`Audit: ${last}/240 samples`);}if(report.finished)break;const status=await page.eval("document.querySelector('#status').textContent");if(/Error:/.test(status))throw Error(status);}
 if(!report?.finished||Date.parse(report.started)<started-2000)throw Error('Audit did not finish');
 console.log(JSON.stringify({finished:report.finished,regressions:report.regressions.length,stateRegressions:report.stateRegressions.length,themes:Object.fromEntries(Object.entries(report.themes).map(([t,v])=>[t,{normalFailures:v.failures.length,stateFailures:report.states.filter(s=>s.theme===t).reduce((n,s)=>n+s.failures.length,0),controlFailures:report.states.filter(s=>s.theme===t).flatMap(s=>s.controlChecks).filter(c=>!c.pass).length}]))},null,2));
 fs.writeFileSync(path.join(cache,'headless-run.json'),JSON.stringify({finished:report.finished,browser:await browser.send('Browser.getVersion')},null,2));
}
}finally{await fetch('http://127.0.0.1:5183/__audit/theme',{method:'POST',body:JSON.stringify({theme:'original'})}).catch(()=>{});if(browser){try{await browser.send('Browser.close')}catch{}}else chrome.kill();page?.ws.close();browser?.ws.close();const resolvedProfile=path.resolve(profile),allowedPrefix=path.resolve(cache)+path.sep+'chrome-verification-profile-';if(!resolvedProfile.startsWith(allowedPrefix))throw Error('Unsafe profile cleanup path');try{fs.rmSync(resolvedProfile,{recursive:true,force:true,maxRetries:10,retryDelay:100})}catch(e){console.warn('Temporary profile cleanup pending:',resolvedProfile,e.code)}}
