// Build proof: between Original, Navy and Light, ONLY the two CSS inputs change.
// Restores Original in finally, even if a build fails. Serves a local-only audit UI.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import http from 'node:http';
import {build} from 'vite';
import react from '@vitejs/plugin-react';
import {execFileSync} from 'node:child_process';
const root=process.cwd(),cache=path.join(root,'.cache/theme-portability');
const files=['palette.css','assignments.css'];
const original=Object.fromEntries(files.map(f=>[f,fs.readFileSync(`src/theme/${f}`)]));
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const fingerprint=()=>crypto.createHash('sha256').update(walk('src').filter(f=>/\.(css|jsx|js)$/.test(f)&&!files.some(n=>f.replaceAll('\\','/').endsWith('theme/'+n))).concat(['tailwind.config.js','vite.config.js','package.json','package-lock.json']).sort().map(f=>f+'\n'+fs.readFileSync(f,'utf8')).join('\n')).digest('hex');
const sourceHash=fingerprint(),proof=[];
const baselineDir=path.join(cache,'baseline-source');
if(!fs.existsSync(baselineDir)){
 const revision='9e5e4bbe492373eb6f336b1a838abee150573e8e';
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:16*1024*1024});
 const paths=git('ls-tree','-r','--name-only',revision,'src','tailwind.config.js').trim().split('\n').filter(f=>/\.(css|js|jsx)$/.test(f));
 const snapshot=Object.fromEntries(paths.map(f=>[f,git('show',revision+':'+f)]));
 for(const[f,s]of Object.entries(snapshot)){const p=path.join(baselineDir,f);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,s);}
 for(const f of ['index.html','postcss.config.js','package.json'])fs.copyFileSync(f,path.join(baselineDir,f));
 fs.cpSync('src/assets',path.join(baselineDir,'src/assets'),{recursive:true});
}
async function compile(name,dir=root){
 process.chdir(dir);
 try{await build({configFile:false,root:dir,plugins:[react()],resolve:{preserveSymlinks:true},build:{outDir:path.join(cache,'builds',name),emptyOutDir:true},logLevel:'warn'});}
 finally{process.chdir(root);}
}
if(!process.argv.includes('--serve-only')){
 try{
  await compile('baseline',baselineDir);
  for(const name of ['original','navy','light']){
   for(const f of files)fs.writeFileSync(`src/theme/${f}`,name==='original'?original[f]:fs.readFileSync(`tests/theme-fixtures/${name}/${f}`));
   if(fingerprint()!==sourceHash)throw Error('Non-theme source changed during build');
   await compile(name);
   proof.push({theme:name,sourceHash,themeFiles:Object.fromEntries(files.map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(`src/theme/${f}`)).digest('hex')]))});
   console.log('Built '+name+' with unchanged application source '+sourceHash.slice(0,12));
  }
 }finally{for(const f of files)fs.writeFileSync(`src/theme/${f}`,original[f]);}
 fs.writeFileSync(path.join(cache,'build-proof.json'),JSON.stringify({sourceHash,restored:files.every(f=>fs.readFileSync(`src/theme/${f}`).equals(original[f])),builds:proof},null,2));
}
let theme='original';
const slugs=[...new Set([...fs.readFileSync('src/data/siteData.js','utf8').matchAll(/slug: "([^"]+)"/g)].map(m=>m[1]))];
const routes=['/','/work','/services','/process','/about','/contact',...slugs.map(s=>'/work/'+s)];
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json'};
const server=http.createServer(async(req,res)=>{
 res.setHeader('Cache-Control','no-store');const url=new URL(req.url,'http://127.0.0.1');
 if(url.pathname==='/__audit/config'){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify({routes,themes:['baseline','original','navy','light'],widths:[1440,768,390]}));}
 if(url.pathname==='/__audit/theme'&&req.method==='POST'){let body='';for await(const b of req)body+=b;const n=JSON.parse(body).theme;if(!['baseline','original','navy','light'].includes(n)){res.statusCode=400;return res.end();}theme=n;return res.end('ok');}
 if(url.pathname==='/__audit/results'&&req.method==='POST'){let body='';for await(const b of req)body+=b;JSON.parse(body);fs.writeFileSync(path.join(cache,'browser-results.json'),body);return res.end('saved');}
 let target=url.pathname==='/__audit'?path.join(root,'tests/theme-portability/audit.html'):url.pathname==='/__audit/audit.js'?path.join(root,'tests/theme-portability/audit.js'):path.join(cache,'builds',theme,decodeURIComponent(url.pathname));
 const allowed=[path.join(root,'tests/theme-portability'),path.join(cache,'builds')];if(!allowed.some(p=>target.startsWith(p+path.sep))){res.statusCode=403;return res.end();}
 if(!fs.existsSync(target)||fs.statSync(target).isDirectory())target=path.join(cache,'builds',theme,'index.html');
 res.setHeader('Content-Type',types[path.extname(target)]||'application/octet-stream');fs.createReadStream(target).pipe(res);
});
server.listen(5183,'127.0.0.1',()=>console.log('Theme audit: http://127.0.0.1:5183/__audit'));
