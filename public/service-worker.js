// workbox untuk cache data
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
 
if (workbox) {
  console.log(`Workbox success`);
} else {
  console.log(`Workbox failed`);
}

// precache
workbox.precaching.precacheAndRoute([
  { 
    url: '/index.html', 
    revision: '1' 
  },
  { 
    url: '/manifest.json', 
    revision: '1' 
  },
  { 
    url: '/push.js', 
    revision: '1' 
  },
  { 
    url: '/service-worker.js', 
    revision: '1' 
  },
  { 
    url: '/css/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2', 
    revision: '1' 
  },
  { 
    url: '/css/materialize-icon.css', 
    revision: '1' 
  },
  { 
    url: '/css/materialize.min.css', 
    revision: '1' 
  },
  { 
    url: '/css/style.css', 
    revision: '1' 
  },
  { 
    url: '/html/about.html', 
    revision: '1' 
  },
  { 
    url: '/html/detail.html', 
    revision: '1' 
  },
  { 
    url: '/html/epl.html', 
    revision: '1' 
  },
  { 
    url: '/html/home.html', 
    revision: '1' 
  },
  { 
    url: '/html/laliga.html', 
    revision: '1' 
  },
  { 
    url: '/html/match.html', 
    revision: '1' 
  },
  { 
    url: '/html/navbar.html', 
    revision: '1' 
  },
  { 
    url: '/html/saved.html', 
    revision: '1' 
  },
  { 
    url: '/html/team.html', 
    revision: '1' 
  },
  { 
    url: '/js/lib/idb.js', 
    revision: '1' 
  },
  { 
    url: '/js/lib/materialize.min.js', 
    revision: '1' 
  },
  { url: 
    '/js/script.js', 
    revision: '1' 
  },
]);

// caching semua file di dalam folder img
workbox.routing.registerRoute(
  new RegExp('/img/'),
  workbox.strategies.cacheFirst({
    cacheName: 'img'
  })
);

// caching semua file di dalam folder js
workbox.routing.registerRoute(
  new RegExp('/js/'),
  workbox.strategies.cacheFirst({
    cacheName: 'js'
  })
);

// caching data dari football api
workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org/,
  workbox.strategies.networkFirst({
      cacheName: 'api-data'
  })
);

// push notification
self.addEventListener('push', function (event) {
    let body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    const options = {
        body: body,
        icon: 'img/icon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});