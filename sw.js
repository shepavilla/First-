// App Europa 2026 · funciona sin internet: la página se actualiza cuando hay conexión y si no, usa la copia guardada
const CACHE="europa26-20261025220911";
const CORE=["./","index.html","manifest.json","icon-180.png","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(r.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith("index.html")){
    e.respondWith(fetch(new Request(r.url,{cache:"no-store"})).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put("index.html",cp));}return res;}).catch(()=>caches.match("index.html")));return;}
  e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));}return res;}).catch(()=>hit);return hit||net;}));
});
