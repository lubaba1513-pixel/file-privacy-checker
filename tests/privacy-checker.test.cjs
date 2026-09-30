// Regression checks execute the actual application with a small simulated DOM.
// No browser rendering, native clipboard, or native download behavior is tested.
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
class Element{constructor(){this.value='';this.textContent='';this.hidden=false;this.children=[];this.listeners={};this.files=[];this.selectionStart=0;this.selectionEnd=0;} addEventListener(k,f){(this.listeners[k]??=[]).push(f)} async fire(k){for(const f of this.listeners[k]||[])await f()} replaceChildren(){this.children=[]} append(...v){this.children.push(...v)} click(){return this.fire('click')} setAttribute(){} scrollIntoView(){} setSelectionRange(s,e){this.selectionStart=s;this.selectionEnd=e} remove(){} focus(){} select(){this.selected=true}}
const ids={}; for(const id of ['inputText','checkButton','findings','fileInput','redactedText','copyButton','reviewSection','reviewList','markButton','downloadButton','clearButton','summary','outputState','demoButton','selectAllButton','deselectAllButton'])ids[id]=new Element();
let downloaded,clipboard;
const ctx={document:{getElementById:id=>ids[id],createElement:()=>new Element(),body:new Element()},getComputedStyle:()=>({lineHeight:'21px'}),navigator:{clipboard:{writeText:async s=>clipboard=s}},Blob,URL:{createObjectURL:b=>{downloaded=b;return 'blob:fake'},revokeObjectURL:()=>{}},setTimeout:()=>1,clearTimeout:()=>{}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8'),ctx);
const input=ids.inputText,out=ids.redactedText,check=()=>ids.checkButton.click();
(async()=>{
input.value='Contact: test@example.com\nPhone: +923001234567\npassword="Fake password with spaces"\napi_key=FAKEabcdefgh12345678\nCard: 4111 1111 1111 1111\n-----BEGIN PRIVATE KEY-----\nFAKE_TEST_DATA\n-----END PRIVATE KEY-----\nOrder number: 1234567890';
await check();assert.equal(ids.reviewList.children.length,6);assert.equal(out.value,'Contact: [EMAIL]\nPhone: [PHONE]\npassword="[PASSWORD]"\napi_key=[SECRET]\nCard: [CARD]\n[PRIVATE KEY]\nOrder number: 1234567890');
let cb=ids.reviewList.children[0].children[0].children[0];cb.checked=false;await cb.fire('change');assert.ok(out.value.includes('test@example.com'));cb.checked=true;await cb.fire('change');
input.selectionStart=input.value.lastIndexOf('1234567890');input.selectionEnd=input.value.length;await ids.markButton.click();assert.equal(ids.reviewList.children.length,7);assert.ok(out.value.endsWith('[REDACTED]'));await ids.markButton.click();assert.equal(ids.reviewList.children.length,7);
await ids.downloadButton.click();assert.equal(await downloaded.text(),out.value);await ids.copyButton.click();assert.equal(clipboard,out.value);
input.value+='x';await input.fire('input');assert.equal(out.value,'');assert.equal(ids.reviewSection.hidden,true);
await ids.clearButton.click();assert.equal(input.value,'');await check();assert.equal(ids.findings.textContent,'Paste some text first.');
input.value='password="two words"\n"api_key": "short+value/="\nOrder: 0000000000000000';await check();assert.equal(out.value,'password="[PASSWORD]"\n"api_key": "[SECRET]"\nOrder: 0000000000000000');
ids.fileInput.files=[{name:'example.txt',size:20,text:async()=> 'Email: test@example.com'}];await ids.fileInput.fire('change');await check();assert.equal(out.value,'Email: [EMAIL]');
ids.fileInput.files=[{name:'bad.csv',size:20}];await ids.fileInput.fire('change');assert.equal(ids.findings.textContent,'Please select a .txt file.');
ids.fileInput.files=[{name:'large.txt',size:1048577}];await ids.fileInput.fire('change');assert.ok(ids.findings.textContent.includes('no larger than'));
let finish;ids.fileInput.files=[{name:'slow.txt',size:20,text:()=>new Promise(r=>finish=r)}];let pending=ids.fileInput.fire('change');await ids.clearButton.click();finish('OLD DATA');await pending;assert.equal(input.value,'');
ids.fileInput.files=[{name:'slow.txt',size:20,text:()=>new Promise(r=>finish=r)}];pending=ids.fileInput.fire('change');input.value='NEW INPUT';await input.fire('input');finish('OLD DATA');await pending;assert.equal(input.value,'NEW INPUT');
input.value='-----BEGIN RSA PRIVATE KEY-----\ntest@example.com\n-----END RSA PRIVATE KEY-----';await check();assert.equal(out.value,'[PRIVATE KEY]');assert.equal(ids.reviewList.children.length,1);
await ids.demoButton.click(); assert.equal(ids.reviewList.children.length,6);assert.equal(ids.summary.children[0].children[0].textContent,'3');assert.equal(ids.outputState.textContent,'6 of 6 removed');
await ids.deselectAllButton.click();assert.equal(out.value,input.value);assert.equal(ids.outputState.textContent,'0 of 6 removed');
await ids.selectAllButton.click();assert.ok(out.value.includes('[PRIVATE KEY]'));assert.equal(ids.outputState.textContent,'6 of 6 removed');
await ids.reviewList.children[0].children[1].click();assert.equal(input.value.slice(input.selectionStart,input.selectionEnd),'test@example.com');
await ids.clearButton.click();assert.equal(ids.summary.hidden,true);assert.equal(ids.copyButton.disabled,true);assert.equal(ids.downloadButton.disabled,true);
input.value=fs.readFileSync(path.join(__dirname,'..','samples','final-privacy-test.txt'),'utf8');
await check();assert.equal(ids.reviewList.children.length,6);
assert.ok(out.value.includes('Order number: 1234567890'));
input.selectionStart=input.value.indexOf('Blue Orchid');input.selectionEnd=input.selectionStart+'Blue Orchid'.length;
await ids.markButton.click();assert.equal(ids.reviewList.children.length,7);
assert.ok(out.value.includes('Internal note: [REDACTED]'));
for(const [id,el]of Object.entries(ids)){for(const [evt,handlers]of Object.entries(el.listeners))assert.equal(handlers.length,1,`${id}:${evt} duplicated`)}
console.log('PASS: detector/redaction logic, quoted secrets and JSON labels, overlap handling, manual selection, checkbox restoration, copy payload, download bytes, input invalidation, clear/empty, file validation, two file-read races, private-key overlap, single event registration. Tested with a simulated DOM; browser layout not tested.');
})().catch(e=>{console.error(e);process.exit(1)});
