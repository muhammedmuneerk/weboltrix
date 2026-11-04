// Static portability contract. Browser regression/contrast lives in verify-theme-portability.mjs.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import postcss from 'postcss';
import {colors} from '../src/theme/tailwind.js';
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const roots=['src/theme','tests/theme-fixtures/navy','tests/theme-fixtures/light'];
let baseContract;
for(const dir of roots){
 const inputs=['palette.css','assignments.css'].map(f=>postcss.parse(fs.readFileSync(`${dir}/${f}`,'utf8')));
 const definitions=new Map(),refs=new Set();
 for(const ast of inputs)ast.walkDecls(d=>{if(d.prop.startsWith('--'))definitions.set(d.prop,d.value);for(const m of d.value.matchAll(/var\((--[\w-]+)/g))refs.add(m[1]);});
 for(const name of refs)assert(definitions.has(name),`${dir}: missing ${name}`);
 for(const name of Object.keys(colors))assert(definitions.has(`--${name}-rgb`),`${dir}: missing utility ${name}`);
 const contract=[];inputs[1].walkRules(r=>contract.push([r.selector,r.nodes.filter(n=>n.type==='decl').map(d=>d.prop)]));
 if(baseContract)assert.deepEqual(contract,baseContract,`${dir}: fixture must preserve the complete role contract`);else baseContract=contract;
 console.log(`${dir}: ${definitions.size} definitions, ${refs.size} resolved reference names; semantic utility contract valid.`);
}
const sources=walk('src').filter(f=>/\.(css|js|jsx)$/.test(f)&&!f.replaceAll('\\','/').startsWith('src/theme/'));
const literals=/(?:bg|text|border|divide|ring|outline|fill|stroke|from|via|to)-(?:white|black|bone|ink|fog|platinum)(?=[/\s"'`}]|$)|var\(--color-/g;
for(const p of sources){const s=fs.readFileSync(p,'utf8');assert(!literals.test(s),`${p}: legacy pigment-purpose consumer`);literals.lastIndex=0;assert(!/(?:(?<!&)#[\da-f]{3,8}\b|rgba?\(\s*\d)/i.test(s),`${p}: hardcoded rendered color`);}
console.log(`${sources.length} source files: no legacy color utilities, palette aliases, hex or numeric RGB literals.`);
console.log('Static contract PASS. This does not replace browser contrast/visual verification.');
