const CACHE_NAME='stats-vision-pwa-2026-07-16-v2';
const BASE_URL=new URL('./',self.location.href);
const INDEX_URL=new URL('index.html',BASE_URL).href;
const APP_SHELL=[
  new URL('./',BASE_URL).href,
  INDEX_URL,
  new URL('manifest.webmanifest',BASE_URL).href,
  new URL('icons/icon-192.png',BASE_URL).href,
  new URL('icons/icon-512.png',BASE_URL).href,
  new URL('icons/icon-maskable-512.png',BASE_URL).href,
  new URL('icons/apple-touch-icon.png',BASE_URL).href
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  if(request.mode==='navigate'){
    event.respondWith(
      fetch(request)
        .then(response=>{
          if(response.ok)caches.open(CACHE_NAME).then(cache=>cache.put(INDEX_URL,response.clone()));
          return response;
        })
        .catch(()=>caches.match(INDEX_URL))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached=>{
      const network=fetch(request)
        .then(response=>{
          if(response.ok)caches.open(CACHE_NAME).then(cache=>cache.put(request,response.clone()));
          return response;
        })
        .catch(()=>cached);
      return cached||network;
    })
  );
});
