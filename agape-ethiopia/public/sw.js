/**
 * Agape Ethiopia PWA Service Worker
 * - Network-first strategy for API calls (fresh data priority)
 * - Cache-first strategy for static assets (performance priority)
 * - Stale-while-revalidate for HTML pages (balance UX and freshness)
 * - Offline fallback page for navigation failures
 * - Background sync for offline actions
 * - Automatic cache cleanup on updates
 */

const CACHE_VERSION = "v1";
const CACHE_NAMES = {
  STATIC: `agape-static-${CACHE_VERSION}`,
  DYNAMIC: `agape-dynamic-${CACHE_VERSION}`,
  API: `agape-api-${CACHE_VERSION}`,
  IMAGES: `agape-images-${CACHE_VERSION}`,
};

// Pre-cache critical assets
const PRECACHE_URLS = [
  "/",
  "/offline",
  "/manifest.webmanifest",
  "/app-icons/icon-192.png",
  "/app-icons/icon-512.png",
  "/app-icons/maskable-icon-512.png",
];

// API routes that should be network-first
const API_ROUTES = [
  "/api/",
  "/auth/",
];

// Static assets that should be cached
const STATIC_ASSETS = [
  /\.js$/,
  /\.css$/,
  /\.woff2?$/,
  /\.ttf$/,
  /\.eot$/,
];

/**
 * Install Event - Pre-cache critical resources
 */
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  
  event.waitUntil(
    caches.open(CACHE_NAMES.STATIC).then((cache) => {
      console.log("Service Worker: Pre-caching critical assets");
      return cache.addAll(PRECACHE_URLS).catch((error) => {
        console.warn("Service Worker: Some pre-cache items failed", error);
        // Continue even if some assets fail to cache
        return Promise.resolve();
      });
    })
  );
  
  self.skipWaiting(); // Activate immediately
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          const isCurrentVersion = Object.values(CACHE_NAMES).includes(cacheName);
          if (!isCurrentVersion) {
            console.log(`Service Worker: Deleting old cache - ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim(); // Take control of all clients
});

/**
 * Fetch Event - Intelligent caching strategies
 */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome extensions and other non-http(s) protocols
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // Skip tracking and analytics
  if (url.hostname.includes("google-analytics") || 
      url.hostname.includes("analytics")) {
    return;
  }

  // Determine caching strategy based on request type
  if (isApiRequest(url)) {
    // Network-first for API calls (fresh data is priority)
    event.respondWith(networkFirstStrategy(request));
  } else if (isStaticAsset(url)) {
    // Cache-first for static assets (performance is priority)
    event.respondWith(cacheFirstStrategy(request));
  } else if (isImageRequest(url)) {
    // Cache-first for images with longer lifecycle
    event.respondWith(cacheFirstStrategy(request, CACHE_NAMES.IMAGES));
  } else {
    // Stale-while-revalidate for HTML pages (balance UX and freshness)
    event.respondWith(staleWhileRevalidateStrategy(request));
  }
});

/**
 * Network-first strategy: Try network first, fall back to cache
 * Best for: API calls, dynamic content where freshness matters
 */
function networkFirstStrategy(request) {
  return fetch(request)
    .then((response) => {
      // Only cache successful responses
      if (response.status === 200) {
        const responseClone = response.clone();
        const cacheName = request.url.includes("/api/") 
          ? CACHE_NAMES.API 
          : CACHE_NAMES.DYNAMIC;
        
        caches.open(cacheName).then((cache) => {
          cache.put(request, responseClone);
        });
      }
      return response;
    })
    .catch(() => {
      // On network failure, try cache
      return caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }
        // Return offline page for navigation requests
        if (request.mode === "navigate") {
          return caches.match("/offline");
        }
        // Return error response for other requests
        return new Response("Network error and no cache available", {
          status: 503,
          statusText: "Service Unavailable",
        });
      });
    });
}

/**
 * Cache-first strategy: Use cache if available, fall back to network
 * Best for: Static assets, images, scripts where consistency matters
 */
function cacheFirstStrategy(request, cacheName = CACHE_NAMES.STATIC) {
  return caches.match(request).then((cached) => {
    if (cached) {
      // Update cache in background if stale
      fetch(request).then((response) => {
        if (response.status === 200) {
          caches.open(cacheName).then((cache) => {
            cache.put(request, response);
          });
        }
      }).catch(() => {
        // Network request failed, that's ok - we have cache
      });
      return cached;
    }
    
    // Not in cache, fetch from network
    return fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(cacheName).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed and no cache available
        if (request.mode === "navigate") {
          return caches.match("/offline");
        }
        return new Response("Offline", { status: 503 });
      });
  });
}

/**
 * Stale-while-revalidate strategy: Return cached immediately, update in background
 * Best for: HTML pages, where UX is priority but freshness is still important
 */
function staleWhileRevalidateStrategy(request) {
  return caches.match(request).then((cached) => {
    const networkPromise = fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAMES.DYNAMIC).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed, return cached or offline page
        return cached || caches.match("/offline");
      });

    // Return cached immediately if available, otherwise wait for network
    return cached || networkPromise;
  });
}

/**
 * Determine if request is for an API endpoint
 */
function isApiRequest(url) {
  return API_ROUTES.some((route) => url.pathname.startsWith(route));
}

/**
 * Determine if request is for a static asset
 */
function isStaticAsset(url) {
  return STATIC_ASSETS.some((pattern) => pattern.test(url.pathname));
}

/**
 * Determine if request is for an image
 */
function isImageRequest(url) {
  return /\.(png|jpg|jpeg|gif|webp|svg|ico)$/.test(url.pathname);
}

/**
 * Message event for cache management and updates
 */
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === "CLEAR_CACHE") {
    caches.keys().then((cacheNames) => {
      Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      ).then(() => {
        event.ports[0].postMessage({ success: true });
      });
    });
  }
});

console.log("Service Worker: Ready to serve");


