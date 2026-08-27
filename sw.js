const CACHE_NAME = 'navigation-shell-v6'; // 💡 每次改殼內容記得手動+1
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './app-icon.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => { if (key !== CACHE_NAME) return caches.delete(key); })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => {
  if (!e.data) return;
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
  
  // 💡 支援從網頁端直接喚醒系統級 Notification 橫幅
  if (e.data.type === 'TRIGGER_PUSH_NOTIFICATION') {
    const title = e.data.title || '動工單導航系統';
    const options = {
      body: e.data.body || '',
      icon: './app-icon.png',
      badge: './app-icon.png',
      vibrate: [100, 50, 100],
      data: { url: './index.html' }
    };
    self.registration.showNotification(title, options);
  }
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes('index.html') && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./index.html');
    })
  );
});

self.addEventListener('fetch', (e) => {
  // 💡 version.json 永遠直接跟網路要最新的，絕不使用快取，這樣才能偵測到新版本
  if (e.request.url.includes('version.json')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
