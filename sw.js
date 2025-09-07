const CACHE = 'apx-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/product.html',
  '/cart.html',
  '/assets/css/styles.css',
  '/assets/js/main.js',
  '/assets/js/cart-badge.js',
  '/assets/js/product.js',
  '/assets/js/cart.js',
  '/assets/js/checkout.js',
  '/data/products.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  if(e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
    const copy = resp.clone();
    caches.open(CACHE).then(c => c.put(e.request, copy));
    return resp;
  })).catch(()=>caches.match('/index.html')));
});