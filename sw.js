const CACHE = "fenice-palcoscenico-v4.9.7";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
const OPTIONAL = ["./spartiti/The_Telephone_CP.pdf", "./spartiti/Trouble_in_Tahiti_CP.pdf"];
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.addAll(CORE).catch(()=>{});
    await Promise.all(OPTIONAL.map(url=>cache.add(url).catch(()=>{})));
  })());
});
self.addEventListener("activate", event => { event.waitUntil((async () => { const keys = await caches.keys(); await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))); await self.clients.claim(); })()); });
self.addEventListener("fetch", event => { const req=event.request;if(req.method!=="GET")return;if(req.mode==="navigate"){event.respondWith((async()=>{try{const fresh=await fetch(req,{cache:"no-store"});const cache=await caches.open(CACHE);cache.put("./index.html",fresh.clone()).catch(()=>{});return fresh}catch(_){return(await caches.match("./index.html"))||(await caches.match("./"))}})());return}event.respondWith((async()=>{try{const fresh=await fetch(req,{cache:"no-cache"});const cache=await caches.open(CACHE);cache.put(req,fresh.clone()).catch(()=>{});return fresh}catch(_){return(await caches.match(req))||Response.error()}})())});
