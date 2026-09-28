const $=s=>document.querySelector(s);
let controller=null,currentFrame=null,ready=false,starting=null;
const input=$("#url"),view=$("#browserView"),status=$("#status");
const base=new URL("./",location.href).pathname;

function normalize(value){
  let u=value.trim();
  if(!u)return null;
  if(!/^https?:\/\//i.test(u))u="https://www.google.com/search?q="+encodeURIComponent(u);
  input.value=u;return u;
}
async function start(){
  if(ready)return true;
  if(starting)return starting;
  starting=(async()=>{
    try{
      if(!("serviceWorker"in navigator))throw new Error("service workers unavailable");
      await navigator.serviceWorker.register("./sw.js",{scope:base});
      if(!navigator.serviceWorker.controller){
        await new Promise(resolve=>{
          const done=()=>{navigator.serviceWorker.removeEventListener("controllerchange",done);resolve()};
          navigator.serviceWorker.addEventListener("controllerchange",done,{once:true});
          setTimeout(resolve,4000);
        });
      }
      const Controller=globalThis.$scramjetController?.Controller;
      if(!Controller)throw new Error("Scramjet controller missing");
      const {default:LibcurlClient}=await import("../libcurl/index.mjs");
      const transport=new LibcurlClient({wisp:"wss://wisp.mercurywork.shop/"});
      await transport.init?.();
      controller=new Controller({
        serviceworker:navigator.serviceWorker.controller,
        transport,
        config:{
          prefix:base+"~/sj/",
          scramjetPath:"../scramjet/scramjet.js",
          injectPath:"../controller/controller.inject.js",
          wasmPath:"../scramjet/scramjet.wasm"
        }
      });
      await controller.wait();
      ready=true;status.textContent="Scramjet 2 ready • nexWeb online";return true;
    }catch(e){
      console.error("[nexWeb] startup failed",e);
      status.textContent="Scramjet failed • check the browser console";
      return false;
    }finally{starting=null}
  })();
  return starting;
}
async function open(){
  const u=normalize(input.value);if(!u)return;
  if(!(await start()))return;
  try{
    if(currentFrame?.element)currentFrame.element.remove();
    view.innerHTML="";
    currentFrame=controller.createFrame();
    currentFrame.element.id="nexWebFrame";
    currentFrame.element.style.cssText="width:100%;height:560px;border:0;display:block;background:#09070d";
    view.appendChild(currentFrame.element);
    currentFrame.go(u);
    status.textContent="nexWeb • "+u;
  }catch(e){console.error(e);status.textContent="navigation failed"}
}
$("#launch").onclick=open;$("#go").onclick=open;$("#openExample").onclick=()=>{input.value="https://example.com";open()};
$("#focus").onclick=()=>input.focus();
input.onkeydown=e=>{if(e.key==="Enter")open()};
$("#back").onclick=()=>{try{currentFrame?.back()}catch{}};
$("#forward").onclick=()=>{try{currentFrame?.forward()}catch{}};
document.querySelectorAll(".quick-card").forEach(b=>b.onclick=()=>{const u=b.dataset.url;if(u.startsWith("https://gameplaza.example"))return;input.value=u;open()});
start();