const CACHE_NAME = "myshop-v1";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/products.html",
  "/cart.html",
  "/style.css",
  "/manifest.json",
  "/images/icon-192x192.png",
  "/images/icon-512x512.png"
];

// INSTALL EVENT
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Caching app shell");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// ACTIVATE EVENT
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// FETCH EVENT
self.addEventListener("fetch", (event) => {
  console.log("[ServiceWorker] Fetching:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// PUSH EVENT
self.addEventListener("push", function (event) {
  console.log("[ServiceWorker] Push Received.");
  const data = event.data ? event.data.json() : {};

  const title = "🔔 MyShop Notification";
  const options = {
    body: data.message || "You have a new message!",
    icon: "images/icon-192x192.png",
    badge: "images/icon-192x192.png",
    vibrate: [100, 50, 100],
    tag: "myshop-push"
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// SYNC EVENT
self.addEventListener('sync', function(event) {
  if (event.tag === 'syncTestTag') {
    console.log("[ServiceWorker] 🔁 Sync event triggered");
    event.waitUntil(
      self.registration.showNotification('🔁 Background Sync Complete', {
        body: 'Your background sync was successfully handled!',
        icon: 'images/icon-192x192.png',
        badge: 'images/icon-192x192.png'
      })
    );
  }
});
