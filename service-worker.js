const CACHE_NAME = "my-cache-v1"

const urlsToCache = [
    "/", 
    "/index.html", 
    "/main.js",
    "/styles/main.css",
    "/styles/quickquizz.css",
    "/quizzCard/index.html",
    "/quizzCard/quickQuizz.js",
]

self.addEventListener("install",(event) => {
    event.wiatUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache)
        })
    )
})

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(
            (response) => {
                return response || fetch(event.request)
            }
        )
    )
})