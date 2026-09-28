const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const winRoot=$("#windows"),iconRoot=$("#icons"),appRoot=$("#apps"),dockRoot=$("#dock"),launcherEl=$("#launcher"),searchEl=$("#search"),clockEl=$("#clock");
const power=$("#power"),setup=$("#setup"),boot=$("#boot"),desktop=$("#desktop"),lock=$("#lock"),powerBtn=$("#powerBtn"),setupContinue=$("#setupContinue"),chime=$("#bootChime");
const STORE_APP_IDS={nexPaint:"paint",nexGames:"games",nexMusic:"music",nexWeather:"weather",nexAI:"ai",nexChat:"chat"};
const A={
about:{n:"About nexOS",i:"◈",w:480,h:320,v:'<div class="welcome"><h1>nexOS</h1><p class="muted">KDE Plasma × macOS-inspired web desktop • Scramjet + WebAssembly</p><p>Glass panels, a dock, real apps and a real Alpine Linux VM.</p><p class="muted">nexOS 0.3 • browser edition</p></div>'},
files:{n:"nexView",i:"▣",w:620,h:460,v:'<div class="view-open"><h2>nexView</h2><p class="muted">Open pictures, video and audio from your device.</p><input id="viewFile" type="file" accept="image/*,video/*,audio/*"><div id="viewPreview" class="view-preview">choose a file</div></div>',o:initView},
browser:{n:"nexite",i:"◎",w:760,h:500,v:'<div class="browser"><div class="browserbar"><button id="back">‹</button><button id="forward">›</button><input id="url" value="https://example.com" placeholder="Search or enter address"><button id="go">Open</button></div><div class="browserinfo"><strong>nexOS Browser</strong><span id="uvStatus">nexite • starting transport…</span></div><div class="browserview"><div class="browser-home"><div class="browser-mark">◎</div><h2>Browse the web</h2><p>Scramjet proxy engine + transport.</p><button id="browserOpen">Open proxied page ↗</button></div><iframe id="uvFrame" title="nexOS proxied browser" referrerpolicy="no-referrer"></iframe></div></div>',o:initBrowser},
notes:{n:"nexJot",i:"▤",w:560,h:440,v:'<div class="jot"><div class="jot-toolbar"><button id="jotSave">Save</button><span id="jotStatus"></span></div><textarea id="notes" placeholder="Start typing…"></textarea></div>',o:initJot},
preferences:{n:"Preferences",i:"⚙",w:760,h:540,v:'<div class="settings-shell"><aside class="settings-nav"><button data-page="appearance" class="active">🎨 <span>Appearance</span></button><button data-page="wallpaper">🖼 <span>Wallpaper</span></button><button data-page="desktopPage">🖥 <span>Desktop</span></button><button data-page="dockPage">▰ <span>Dock</span></button><button data-page="accessPage">♿ <span>Accessibility</span></button><button data-page="aboutPage">ⓘ <span>About</span></button></aside><div class="settings-content"><div id="appearance" class="settings-page"><h1>Appearance</h1><p>Customize nexOS.</p><section><label>Color scheme <select id="settingTheme"><option value="dark">Dark</option><option value="light">Light</option></select></label><label>Accent color <select id="settingAccent"><option value="blue">Blue</option><option value="violet">Violet</option><option value="pink">Pink</option></select></label></section></div><div id="wallpaper" class="settings-page hidden"><h1>Wallpaper</h1><p>Choose a background.</p><div class="wall-grid"><button data-setting="default" class="wall-card wall-default">Default</button><button data-setting="midnight" class="wall-card wall-midnight">Midnight</button><button data-setting="sunset" class="wall-card wall-sunset">Sunset</button><button data-setting="aurora" class="wall-card wall-aurora">Aurora</button><button data-setting="ocean" class="wall-card wall-ocean">Ocean</button><button data-setting="rose" class="wall-card wall-rose">Rose</button><button data-setting="forest" class="wall-card wall-forest">Forest</button><button data-setting="mono" class="wall-card wall-mono">Mono</button></div></div><div id="desktopPage" class="settings-page hidden"><h1>Desktop</h1><section><label>Icon size <input id="settingIconSize" type="range" min="60" max="110" value="75"></label><button id="resetIcons">Reset icon positions</button></section><section><label class="check"><input id="settingClock24" type="checkbox"> 24-hour clock</label></section></div><div id="dockPage" class="settings-page hidden"><h1>Dock</h1><section><label>Dock icon size <input id="dockSize" type="range" min="40" max="64" value="48"></label><label>Shelf opacity <input id="shelfOpacity" type="range" min="45" max="95" value="72"></label><label>Shelf blur <input id="shelfBlur" type="range" min="8" max="40" value="28"></label><label>Shelf roundness <input id="shelfRadius" type="range" min="10" max="30" value="19"></label><label class="check"><input id="showDock" type="checkbox" checked> Show floating shelf</label></section></div><div id="accessPage" class="settings-page hidden"><h1>Accessibility</h1><section><label class="check"><input id="reduceMotion" type="checkbox"> Reduce motion</label><label class="check"><input id="largeText" type="checkbox"> Larger text</label><label class="check"><input id="contrast" type="checkbox"> High contrast</label></section></div><div id="aboutPage" class="settings-page hidden"><h1>About nexOS</h1><p>nexOS 0.3 • browser edition</p></div></div></div>',o:initPreferences},
terminal:{n:"nexTerm",i:"⌘",w:760,h:500,v:'<div class="term"><div class="alpine-toolbar"><span><b>nexTerm</b> • real Alpine Linux</span><span id="alpineStatus">waiting to boot…</span><button id="alpineBoot">Boot</button><button id="alpineRestart">Restart</button><button id="alpineSave">Save VM</button><button id="alpineRestore">Restore VM</button><input id="alpineRestoreFile" type="file" accept=".bin,.zst" hidden></div><div id="alpineScreen" class="alpine-screen"><div class="alpine-placeholder">real Alpine Linux • WebAssembly x86 VM<br><small>booting only happens when you press Boot</small></div></div></div>',o:initTerminal},
store:{n:"nexStore",i:"🛍",w:720,h:520,v:'<div class="store-app"><div class="store-head"><div><h1>nexStore</h1><p class="muted">apps fetched from the nexOS community catalog.</p></div><button id="storeRefresh">↻ Refresh</button></div><div id="storeStatus" class="muted">loading catalog…</div><div id="storeGrid" class="store-grid"></div></div>',o:initStore},
games:{n:"nexGames",i:"🎮",w:560,h:430,v:'<div><h1>nexGames</h1><p class="muted">tiny games that run locally.</p><div class="game-grid"><div class="game-card"><b>Clicker</b><br><span id="clickScore">0 clicks</span><br><button id="clickGame">Click!</button></div><div class="game-card"><b>Guess</b><br><small>guess a number from 1–10</small><input id="guessInput" type="number" min="1" max="10"><button id="guessGame">Guess</button><span id="guessResult"></span></div></div></div>',o:initGames},
music:{n:"nexMusic",i:"♫",w:600,h:420,v:'<div class="view-open"><h1>nexMusic</h1><p class="muted">play local audio files.</p><input id="musicFile" type="file" accept="audio/*"><div id="musicPlayer" class="view-preview">choose an audio file</div></div>',o:initMusic},
weather:{n:"nexWeather",i:"☁",w:560,h:420,v:'<div><h1>nexWeather</h1><p class="muted">local demo weather dashboard.</p><div class="store-card"><b>New York</b><h2>72°F</h2><span>Partly cloudy • demo data</span></div></div>'},
paint:{n:"nexPaint",i:"🎨",w:560,h:430,v:'<div><h1>nexPaint</h1><canvas id="paintCanvas" width="500" height="320" style="max-width:100%;background:#fff;border-radius:12px"></canvas></div>',o:initPaint}
};
let z=20,count=0;let currentApp="Finder";
function setCurrentApp(id){currentApp=A[id]?.n||"Finder";const m=$("#menuApp");if(m)m.textContent=currentApp}
function openApp(id){const old=$('.window[data-app="'+id+'"]');if(old){old.style.display="flex";focus(old);setCurrentApp(id);return}const a=A[id];if(!a)return;const w=document.createElement("section");w.className="window";w.dataset.app=id;w.style.width=a.w+"px";w.style.height=a.h+"px";w.style.left=120+(count++%5)*30+"px";w.style.top=70+(count%5)*25+"px";w.style.zIndex=++z;w.innerHTML='<div class="title"><div class="traffic"><button class="x"></button><button class="m"></button><button class="g"></button></div><strong>'+a.n+'</strong></div><div class="body">'+a.v+'</div><div class="resize"></div>';winRoot.appendChild(w);requestAnimationFrame(()=>w.classList.add("shown"));wireWindow(w);if(a.o)a.o();setCurrentApp(id);renderDock()}
function focus(w){w.style.zIndex=++z}
function wireWindow(w){w.onpointerdown=()=>{focus(w);setCurrentApp(w.dataset.app)};w.querySelector(".x").onclick=()=>{w.remove();renderDock()};w.querySelector(".m").onclick=()=>w.style.display="none";w.querySelector(".g").onclick=()=>w.classList.toggle("max");const bar=w.querySelector(".title");let drag=null;bar.onpointerdown=e=>{if(e.target.tagName==="BUTTON"||w.classList.contains("max"))return;drag=[e.clientX-parseFloat(w.style.left),e.clientY-parseFloat(w.style.top)];bar.setPointerCapture(e.pointerId)};bar.onpointermove=e=>{if(drag){w.style.left=Math.max(3,e.clientX-drag[0])+"px";w.style.top=Math.max(45,e.clientY-drag[1])+"px"}};bar.onpointerup=()=>drag=null;const r=w.querySelector(".resize");let size=null;r.onpointerdown=e=>{size=[e.clientX,w.offsetWidth,e.clientY,w.offsetHeight];r.setPointerCapture(e.pointerId)};r.onpointermove=e=>{if(size&&!w.classList.contains("max")){w.style.width=Math.max(300,size[1]+e.clientX-size[0])+"px";w.style.height=Math.max(180,size[3]+e.clientY-size[2])+"px"}};r.onpointerup=()=>size=null}
function renderDock(){dockRoot.innerHTML="";Object.keys(A).forEach(id=>{if($('.window[data-app="'+id+'"]')){const b=document.createElement("button");b.textContent=A[id].i;b.title=A[id].n;b.onclick=()=>openApp(id);dockRoot.appendChild(b)}})}
function initPreferences(){initSettings()}
function initSettings(){const theme=$("#settingTheme"),accent=$("#settingAccent"),size=$("#settingIconSize"),clock24=$("#settingClock24"),dockSize=$("#dockSize"),shelfOpacity=$("#shelfOpacity"),shelfBlur=$("#shelfBlur"),shelfRadius=$("#shelfRadius"),showDock=$("#showDock"),reduce=$("#reduceMotion"),large=$("#largeText"),contrast=$("#contrast");theme.value=localStorage.nexTheme||"dark";accent.value=localStorage.nexAccent||"blue";size.value=localStorage.nexIconSize||75;clock24.checked=localStorage.nexClock24==="1";dockSize.value=localStorage.nexDockSize||48;shelfOpacity.value=localStorage.nexShelfOpacity||72;shelfBlur.value=localStorage.nexShelfBlur||28;shelfRadius.value=localStorage.nexShelfRadius||19;showDock.checked=localStorage.nexShowDock!=="0";reduce.checked=localStorage.nexReduce==="1";large.checked=localStorage.nexLarge==="1";contrast.checked=localStorage.nexContrast==="1";const apply=()=>{document.body.classList.toggle("light",theme.value==="light");document.body.dataset.accent=accent.value;document.body.dataset.wall=localStorage.nexWall||"default";iconRoot.style.setProperty("--icon-size",size.value+"px");dockRoot.style.setProperty("--dock-size",dockSize.value+"px");document.querySelector("footer")?.style.setProperty("--shelf-opacity",(shelfOpacity.value/100).toFixed(2));document.querySelector("footer")?.style.setProperty("--shelf-blur",shelfBlur.value+"px");document.querySelector("footer")?.style.setProperty("--shelf-radius",shelfRadius.value+"px");document.body.classList.toggle("reduce-motion",reduce.checked);document.body.classList.toggle("large-text",large.checked);document.body.classList.toggle("high-contrast",contrast.checked);localStorage.nexTheme=theme.value;localStorage.nexAccent=accent.value;localStorage.nexIconSize=size.value;localStorage.nexClock24=clock24.checked?"1":"0";localStorage.nexDockSize=dockSize.value;localStorage.nexShelfOpacity=shelfOpacity.value;localStorage.nexShelfBlur=shelfBlur.value;localStorage.nexShelfRadius=shelfRadius.value;localStorage.nexShowDock=showDock.checked?"1":"0";localStorage.nexReduce=reduce.checked?"1":"0";localStorage.nexLarge=large.checked?"1":"0";localStorage.nexContrast=contrast.checked?"1":"0";$("#dock").parentElement.classList.toggle("dock-hidden",!showDock.checked);updateClock()};[theme,accent].forEach(x=>x.addEventListener("change",apply));[size,dockSize,shelfOpacity,shelfBlur,shelfRadius].forEach(x=>x.addEventListener("input",apply));[clock24,showDock,reduce,large,contrast].forEach(x=>x.addEventListener("change",apply));$("#resetIcons").onclick=()=>{localStorage.removeItem("nexIconPositions");location.reload()};$(".settings-nav button").forEach(b=>b.onclick=()=>{$(".settings-page").forEach(p=>p.classList.add("hidden"));$("#"+b.dataset.page).classList.remove("hidden");$(".settings-nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active")});$("[data-setting]").forEach(b=>b.onclick=()=>{const k=b.dataset.setting;document.body.dataset.wall=k;localStorage.nexWall=k;$("[data-setting]").forEach(x=>x.classList.remove("active"));b.classList.add("active")});$('[data-setting="'+(localStorage.nexWall||"default")+'"]')?.classList.add("active");apply()}
function saveIconPositions(){const p={};$(".icon").forEach(d=>p[d.dataset.app]={left:d.style.left,top:d.style.top});localStorage.nexIconPositions=JSON.stringify(p)}
function makeIconMovable(d,id){d.dataset.app=id;let drag=null,moved=false;d.ondblclick=()=>openApp(id);d.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();e.stopPropagation();$$(".icon").forEach(x=>x.classList.remove("selected"));d.classList.add("selected");const r=d.getBoundingClientRect();drag={x:e.clientX-r.left,y:e.clientY-r.top,startX:e.clientX,startY:e.clientY};moved=false;d.setPointerCapture(e.pointerId)};d.onpointermove=e=>{if(!drag)return;e.preventDefault();const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;if(Math.abs(dx)+Math.abs(dy)>4)moved=true;if(!moved)return;const root=iconRoot.getBoundingClientRect();d.style.left=Math.max(0,e.clientX-root.left-drag.x)+"px";d.style.top=Math.max(0,e.clientY-root.top-drag.y)+"px"};d.onpointerup=e=>{if(!drag)return;e.preventDefault();if(moved)saveIconPositions();drag=null};d.onpointercancel=()=>{drag=null}}
function populate(){
  const saved=JSON.parse(localStorage.nexIconPositions||"{}");
  iconRoot.innerHTML="";appRoot.innerHTML="";
  const core=new Set(["about","files","browser","notes","preferences","terminal","store","ai","chat"]);
  const installedPkgs=Object.values(getPackages());
  const visible=Object.entries(A).filter(([id])=>core.has(id)||localStorage.getItem("nexInstalled_"+id)==="1");
  visible.forEach(([id,a])=>{
    const d=document.createElement("button");d.className="icon";d.innerHTML="<b>"+a.i+"</b><small>"+a.n+"</small>";
    if(saved[id]){d.style.left=saved[id].left;d.style.top=saved[id].top}else{const n=visible.findIndex(x=>x[0]===id);d.style.left=(n%2)*95+"px";d.style.top=Math.floor(n/2)*90+"px"}
    makeIconMovable(d,id);iconRoot.appendChild(d);
    const x=document.createElement("button");x.className="app";x.dataset.app=id;x.innerHTML="<b>"+a.i+"</b><small>"+a.n.replace("About ","")+"</small>";x.onclick=()=>{openApp(id);launcherEl.classList.add("hidden")};appRoot.appendChild(x)
  });
  installedPkgs.forEach((p,i)=>{
    const d=document.createElement("button");d.className="icon";d.innerHTML="<b>"+(p.icon||"📦")+"</b><small>"+p.name+"</small>";d.style.left=(i%2)*95+"px";d.style.top=(Math.floor((visible.length+i)/2))*90+"px";d.ondblclick=()=>openPackage(p.id);d.onclick=()=>{$$(".icon").forEach(x=>x.classList.remove("selected"));d.classList.add("selected")};iconRoot.appendChild(d);
    const x=document.createElement("button");x.className="app";x.innerHTML="<b>"+(p.icon||"📦")+"</b><small>"+p.name+"</small>";x.onclick=()=>{openPackage(p.id);launcherEl.classList.add("hidden")};appRoot.appendChild(x)
  })
}
$("#launch").onclick=()=>launcherEl.classList.toggle("hidden");$("#brand").onclick=()=>launcherEl.classList.remove("hidden");document.querySelectorAll("[data-app]").forEach(b=>b.onclick=()=>openApp(b.dataset.app));searchEl.oninput=()=>$$(".app").forEach(x=>x.classList.toggle("hidden",!x.textContent.toLowerCase().includes(searchEl.value.toLowerCase())));document.addEventListener("keydown",e=>{if(e.key==="Escape")launcherEl.classList.add("hidden")});
function updateClock(){clockEl.textContent=new Intl.DateTimeFormat([],{weekday:"short",hour:"numeric",minute:"2-digit"}).format(new Date())}setInterval(updateClock,1000);updateClock();
const quickPanel=$("#quickPanel"),shelfStatus=$("#shelfStatus"),closeQuick=$("#closeQuick"),shelfTime=$("#shelfTime");
function updateShelfTime(){if(!shelfTime)return;shelfTime.textContent=new Intl.DateTimeFormat([],{hour:"numeric",minute:"2-digit"}).format(new Date())}
setInterval(updateShelfTime,1000);updateShelfTime();
shelfStatus?.addEventListener("click",()=>quickPanel?.classList.toggle("hidden"));
closeQuick?.addEventListener("click",()=>quickPanel?.classList.add("hidden"));
$("#quickLauncher")?.addEventListener("click",()=>{launcherEl.classList.remove("hidden");quickPanel?.classList.add("hidden")});
$("#quickTheme")?.addEventListener("click",()=>{document.body.classList.toggle("light");localStorage.nexTheme=document.body.classList.contains("light")?"light":"dark";quickPanel?.classList.add("hidden")});
$("#quickMotion")?.addEventListener("click",()=>{document.body.classList.toggle("reduce-motion");localStorage.nexReduce=document.body.classList.contains("reduce-motion")?"1":"0"});
function updateLockClock(){const d=new Date();$("#lockTime").textContent=new Intl.DateTimeFormat([],{hour:"numeric",minute:"2-digit"}).format(d);$("#lockDate").textContent=new Intl.DateTimeFormat([],{weekday:"long",month:"long",day:"numeric"}).format(d)}setInterval(updateLockClock,1000);
function initCalc(){let v="0";$$("[data-k]").forEach(b=>b.onclick=()=>{const k=b.dataset.k;if(k==="C")v="0";else if(k==="="){try{v=String(Function("return "+v)())}catch{v="Error"}}else v=v==="0"&&!"+-*/.".includes(k)?k:v+k;$("#out").textContent=v})}
function initTerminal(){
  const screen=$("#alpineScreen"),status=$("#alpineStatus"),boot=$("#alpineBoot"),restart=$("#alpineRestart"),save=$("#alpineSave"),restore=$("#alpineRestore"),restoreFile=$("#alpineRestoreFile");
  let emulator=null,booted=false;
  const setStatus=t=>{if(status)status.textContent=t};
  const start=async()=>{
    if(booted&&emulator)return;
    if(typeof V86==="undefined"){setStatus("v86 failed to load");return}
    screen.innerHTML="";
    try{
      emulator=new V86({
        wasm_path:"https://cdn.jsdelivr.net/npm/v86@0.5/build/v86.wasm",
        memory_size:512*1024*1024,
        vga_memory_size:8*1024*1024,
        screen_container:screen,
        bios:{url:"https://cdn.jsdelivr.net/gh/copy/v86@master/bios/seabios.bin"},
        vga_bios:{url:"https://cdn.jsdelivr.net/gh/copy/v86@master/bios/vgabios.bin"},
        filesystem:{baseurl:"./alpine/alpine-rootfs-flat",basefs:"./alpine/alpine-fs.json"},
        autostart:true,
        bzimage_initrd_from_filesystem:true,
        cmdline:"rw root=host9p rootfstype=9p rootflags=trans=virtio,cache=loose modules=virtio_pci tsc=reliable"
      });
      booted=true;
      setStatus("Alpine Linux • booting…");
      setTimeout(()=>setStatus("Alpine Linux • running"),3500);
    }catch(e){
      console.error(e);
      screen.innerHTML='<div class="alpine-placeholder">Alpine failed to boot.<br><small>'+String(e.message||e)+'</small></div>';
      setStatus("boot failed");
    }
  };
  boot.onclick=start;
  restart.onclick=()=>{if(emulator){emulator.stop();emulator.destroy?.();emulator=null;booted=false}start()};
  save.onclick=async()=>{
    if(!emulator)return setStatus("boot Alpine first");
    try{
      const state=await emulator.save_state();
      const db=await new Promise((resolve,reject)=>{
        const r=indexedDB.open("nexOS",1);
        r.onupgradeneeded=()=>r.result.createObjectStore("vm");
        r.onsuccess=()=>resolve(r.result);
        r.onerror=()=>reject(r.error)
      });
      await new Promise((resolve,reject)=>{
        const tx=db.transaction("vm","readwrite");tx.objectStore("vm").put(state,"alpine");
        tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)
      });
      db.close();setStatus("VM saved ✓")
    }catch(e){console.error(e);setStatus("save failed")}
  };
  restore.onclick=()=>restoreFile.click();
  restoreFile.onchange=async()=>{
    const f=restoreFile.files?.[0];if(!f)return;
    try{
      const state=await f.arrayBuffer();
      if(!emulator)await start();
      emulator.stop();await emulator.restore_state(state);emulator.run();booted=true;setStatus("VM restored ✓")
    }catch(e){console.error(e);setStatus("restore failed")}
    restoreFile.value="";
  };
  const autoRestore=async()=>{
    try{
      const db=await new Promise((resolve,reject)=>{
        const r=indexedDB.open("nexOS",1);r.onupgradeneeded=()=>r.result.createObjectStore("vm");
        r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)
      });
      const state=await new Promise((resolve,reject)=>{
        const tx=db.transaction("vm","readonly");const r=tx.objectStore("vm").get("alpine");
        r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)
      });
      db.close();
      if(state){await start();emulator.stop();await emulator.restore_state(state);emulator.run();setStatus("Alpine Linux • restored")}
    }catch{}
  };
  autoRestore();
}
function initJot(){const n=$("#notes"),s=$("#jotStatus");n.value=localStorage.nexNotes||"";$("#jotSave").onclick=()=>{localStorage.nexNotes=n.value;s.textContent="Saved ✓";setTimeout(()=>s.textContent="",1200)}}
function initView(){const input=$("#viewFile"),p=$("#viewPreview");input.onchange=()=>{const f=input.files[0];if(!f)return;const u=URL.createObjectURL(f);p.innerHTML="";if(f.type.startsWith("image/")){const x=document.createElement("img");x.src=u;p.appendChild(x)}else if(f.type.startsWith("video/")){const x=document.createElement("video");x.src=u;x.controls=true;p.appendChild(x)}else if(f.type.startsWith("audio/")){const x=document.createElement("audio");x.src=u;x.controls=true;p.appendChild(x)}else p.textContent="unsupported file"}}
function initMusic(){
  const input=$("#musicFile"),player=$("#musicPlayer");
  input.onchange=()=>{
    const f=input.files?.[0];if(!f)return;
    const url=URL.createObjectURL(f);
    player.innerHTML="";
    const a=document.createElement("audio");a.controls=true;a.src=url;a.style.width="90%";
    player.appendChild(a)
  }
}
function getPackages(){try{return JSON.parse(localStorage.nexPackages||"{}")}catch{return{}}}
function savePackages(p){localStorage.nexPackages=JSON.stringify(p)}
function openPackage(id){const p=getPackages()[id];if(!p?.entry)return;const w=document.createElement("section");w.className="window";w.dataset.pkg=id;w.style.width="680px";w.style.height="500px";w.style.left=140+(count++%4)*30+"px";w.style.top=80+(count%4)*25+"px";w.style.zIndex=++z;w.innerHTML='<div class="title"><div class="traffic"><button class="x"></button><button class="m"></button><button class="g"></button></div><strong>'+p.name+'</strong></div><div class="body" style="padding:0"><iframe title="'+p.name+'" src="'+p.entry+'" sandbox="allow-scripts allow-forms allow-popups allow-modals" style="width:100%;height:100%;border:0;border-radius:0 0 12px 12px;background:#080a10"></iframe></div><div class="resize"></div>';winRoot.appendChild(w);requestAnimationFrame(()=>w.classList.add("shown"));wireWindow(w);setCurrentApp(id);renderDock()}
async function initStore(){
  const grid=$("#storeGrid"),status=$("#storeStatus"),refresh=$("#storeRefresh");
  const catalogUrl="https://raw.githubusercontent.com/techmaster2013/nexOS/main/store/catalog.json";
  const render=items=>{
    const installed=getPackages();grid.innerHTML="";
    items.forEach(p=>{
      const card=document.createElement("div");card.className="store-card";
      card.innerHTML='<div class="store-icon">'+(p.icon||"📦")+'</div><b>'+p.name+'</b><small>v'+p.version+'</small><p>'+p.description+'</p><button></button>';
      const b=card.querySelector("button");const is=!!installed[p.id];b.textContent=is?"Open":"Install";
      b.onclick=async()=>{
        if(is){openPackage(p.id);return}
        b.disabled=true;b.textContent="Downloading…";
        try{
          const res=await fetch(p.package,{cache:"no-store"});if(!res.ok)throw new Error("package fetch "+res.status);
          const pkg=await res.json();
          if(pkg.format!=="nexpkg"||pkg.version!==1||pkg.id!==p.id||!pkg.entry)throw new Error("invalid nexPKG");
          const all=getPackages();all[pkg.id]=pkg;savePackages(all);populate();render(items);status.textContent=pkg.name+" installed ✓"
        }catch(e){console.error(e);b.disabled=false;b.textContent="Retry";status.textContent="couldn't install "+p.name}
      };
      grid.appendChild(card)
    });
  };
  const load=async()=>{
    status.textContent="fetching catalog…";refresh.disabled=true;
    try{
      const res=await fetch(catalogUrl+"?t="+Date.now(),{cache:"no-store"});if(!res.ok)throw new Error("catalog "+res.status);
      const data=await res.json();render(data.packages||[]);status.textContent=(data.packages||[]).length+" packages available • live from GitHub"
    }catch(e){console.error(e);status.textContent="catalog unavailable — check your connection";grid.innerHTML='<div class="store-card"><b>nexStore offline</b><p>GitHub catalog could not be reached.</p></div>'}
    refresh.disabled=false
  };
  refresh.onclick=load;load()
}
function initGames(){let score=0;$("#clickGame").onclick=()=>{$("#clickScore").textContent=++score+" clicks"};const n=Math.floor(Math.random()*10)+1;$("#guessGame").onclick=()=>{$("#guessResult").textContent=Number($("#guessInput").value)===n?" 🎉 correct!":" nope 😭"}}
function initPaint(){const c=$("#paintCanvas"),x=c.getContext("2d");let down=false;c.onpointerdown=e=>{down=true;x.beginPath();x.moveTo(e.offsetX,e.offsetY)};c.onpointermove=e=>{if(!down)return;x.lineTo(e.offsetX,e.offsetY);x.stroke()};c.onpointerup=()=>down=false}
function initBrowser(){
  const input=$("#url"),frame=$("#uvFrame"),view=$(".browserview"),status=$("#uvStatus");
  let ready=false,controller=null,currentFrame=null;
  const base=new URL("./",location.href).pathname;
  const makeUrl=()=>{
    let u=input.value.trim();if(!u)return null;
    if(!/^https?:\/\//i.test(u))u="https://www.google.com/search?q="+encodeURIComponent(u);
    input.value=u;return u
  };
  const start=async()=>{
    try{
      if(!("serviceWorker" in navigator))throw new Error("Service workers are unavailable");
      await navigator.serviceWorker.register("./sw.js",{scope:base});
      if(!navigator.serviceWorker.controller){
        await new Promise(resolve=>{
          const done=()=>{navigator.serviceWorker.removeEventListener("controllerchange",done);resolve()};
          navigator.serviceWorker.addEventListener("controllerchange",done,{once:true});
          setTimeout(resolve,5000)
        })
      }
      const Controller=globalThis.$scramjetController?.Controller;
      if(!Controller)throw new Error("Scramjet 2 controller failed to load");
      const {default:LibcurlClient}=await import("./libcurl/index.mjs");
      const transport=new LibcurlClient({wisp:"wss://wisp.mercurywork.shop/"});
      await transport.init?.();
      controller=new Controller({
        serviceworker:navigator.serviceWorker.controller,
        transport,
        config:{
          prefix:base+"~/sj/",
          scramjetPath:base+"scramjet/scramjet.js",
          injectPath:base+"controller/controller.inject.js",
          wasmPath:base+"scramjet/scramjet.wasm"
        }
      });
      await controller.wait();
      ready=true;status.textContent="nexite • Scramjet 2 ready"
    }catch(e){
      console.error("nexite Scramjet 2 startup failed",e);
      status.textContent="nexite • Scramjet failed";
    }
  };
  const open=async()=>{
    const u=makeUrl();if(!u)return;
    if(!ready)await start();
    if(!ready)return;
    try{
      if(currentFrame?.element)currentFrame.element.remove();
      currentFrame=controller.createFrame();
      currentFrame.element.id="uvFrame";
      frame?.remove();
      view.appendChild(currentFrame.element);
      currentFrame.go(u)
    }catch(e){console.error(e);status.textContent="nexite • navigation failed"}
  };
  $("#go").onclick=open;$("#browserOpen").onclick=open;
  input.onkeydown=e=>{if(e.key==="Enter")open()};
  $("#back").onclick=()=>{try{currentFrame?.back()}catch{}};
  $("#forward").onclick=()=>{try{currentFrame?.forward()}catch{}};
  start()
}
const profileChoices=["●","◆","★","✦","☻","◉","✿","☀","☾","♟","🦊","🐱"];$("#profileIcons")?.querySelectorAll("button").forEach(b=>{if(b.dataset.profile===(localStorage.nexProfile||"0"))b.classList.add("active");b.onclick=()=>{$("#profileIcons").querySelectorAll("button").forEach(x=>x.classList.remove("active"));b.classList.add("active");localStorage.nexProfile=b.dataset.profile}});
function startBoot(){try{if(!document.fullscreenElement&&document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{})}catch{}power.classList.add("hidden");lock.classList.add("hidden");desktop.classList.add("hidden");boot.classList.remove("hidden");try{chime.currentTime=0;chime.play().catch(()=>{})}catch{}setTimeout(()=>{boot.classList.add("hidden");if(!localStorage.nexSetupDone){setup.classList.remove("hidden")}else{lock.classList.remove("hidden");$("#lockName").textContent=localStorage.nexDisplay||"nex";$("#lockAvatar").textContent=profileChoices[Number(localStorage.nexProfile||0)]||"●";$("#unlockPass").value="";updateLockClock()}},1600)}
powerBtn.onclick=startBoot;
setupContinue.onclick=()=>{const name=$("#setupName").value.trim(),user=$("#setupUser").value.trim(),pass=$("#setupPass").value;if(!name||!user||!pass){setupContinue.textContent="fill in all three fields →";return}localStorage.nexSetupDone="1";localStorage.nexDisplay=name;localStorage.nexUser=user;localStorage.nexPass=pass;localStorage.nexSetupDone="1";setup.classList.add("hidden");desktop.classList.remove("hidden");$("#lockAvatar").textContent=profileChoices[Number(localStorage.nexProfile||0)]||"●";openApp("about")};
$("#unlockBtn").onclick=()=>{const input=$("#unlockPass"),err=$("#unlockError");if(input.value===localStorage.nexPass){err.textContent="";input.value="";lock.classList.add("hidden");desktop.classList.remove("hidden");openApp("about")}else{err.textContent="incorrect password";input.value="";input.focus()}};
$("#unlockPass").onkeydown=e=>{if(e.key==="Enter")$("#unlockBtn").click()};$("#forgotBtn").onclick=async()=>{const ok=confirm("Reset nexOS? This will erase nexOS data for this site, including your account, notes, settings, and saved site data. It cannot erase your browser's global history or HTTP cache.");if(!ok)return;try{const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));if("serviceWorker" in navigator){const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(r=>r.unregister()))}}catch{}localStorage.clear();sessionStorage.clear();location.reload()};
populate();
const selection=document.createElement("div");selection.id="selectionBox";desktop.appendChild(selection);let selecting=null;desktop.addEventListener("pointerdown",e=>{if(e.target!==desktop&&e.target!==iconRoot)return;if(e.target.classList&&e.target.classList.contains("icon"))return;selecting=[e.clientX,e.clientY];selection.style.display="block";selection.style.left=e.clientX+"px";selection.style.top=e.clientY+"px";selection.style.width="0px";selection.style.height="0px";$$(".icon").forEach(x=>x.classList.remove("selected"))});desktop.addEventListener("pointermove",e=>{if(!selecting)return;const x=Math.min(selecting[0],e.clientX),y=Math.min(selecting[1],e.clientY),w=Math.abs(e.clientX-selecting[0]),h=Math.abs(e.clientY-selecting[1]);selection.style.left=x+"px";selection.style.top=y+"px";selection.style.width=w+"px";selection.style.height=h+"px";const sr=selection.getBoundingClientRect();$$(".icon").forEach(i=>{const r=i.getBoundingClientRect();if(r.left<sr.right&&r.right>sr.left&&r.top<sr.bottom&&r.bottom>sr.top)i.classList.add("selected")})});desktop.addEventListener("pointerup",()=>{selecting=null;selection.style.display="none"});
/* ============================================================
   nexOS UX / performance extras
   ============================================================ */
(function(){
  const idle=window.requestIdleCallback||function(fn){return setTimeout(fn,1)};
  idle(async()=>{
    try{
      if(navigator.storage?.persist) await navigator.storage.persist();
    }catch{}
    try{document.documentElement.style.setProperty("content-visibility","auto")}catch{}
  });

  const isEditable=el=>{
    const t=el?.tagName?.toLowerCase();
    return t==="input"||t==="textarea"||t==="select"||el?.isContentEditable;
  };

  window.addEventListener("keydown",e=>{
    if(isEditable(e.target)) return;
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){
      e.preventDefault();
      launcherEl.classList.toggle("hidden");
      if(!launcherEl.classList.contains("hidden")){searchEl.value="";searchEl.focus()}
      return;
    }
    if(e.key==="Escape"){
      launcherEl.classList.add("hidden");
      $("#quickPanel")?.classList.add("hidden");
      return;
    }
  });

  document.addEventListener("visibilitychange",()=>{
    if(!document.hidden) updateClock();
  });

  window.addEventListener("error",e=>{
    console.warn("[nexOS] recovered from UI error:",e.message||e.error);
  },{passive:true});
})();
