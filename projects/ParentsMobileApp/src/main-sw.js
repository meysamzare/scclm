var version = "1.3.2";
var cacheName = 'js13kMs2PWA-v1';
const expectedCaches = ['js13kMs2PWA-v1'];
var contentToCache = [
    '/',
    '/index.html'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(contentToCache);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (!expectedCaches.includes(key)) {
                    return caches.delete(key);
                }
            })
        ))
    );
});


self.addEventListener('fetch', (e) => {

    // e.respondWith(
    //     caches.match(e.request).then(response => {

    //         if (response) {
    //             return response
    //         } else {
    //             fetch(e.request).then(response => {
    //                 return caches.open(cacheName).then(cache => {
    //                     // console.log('[Service Worker] Caching new resource: ' + e.request.url);
    //                     if (!e.request.url.startsWith("chrome-extension") && e.request.method != "POST") {
    //                         cache.put(e.request, response.clone());
    //                     }
    //                     return response;
    //                 });
    //             });
    //         }
    //     })
    // );

    e.respondWith(async function () {
        try {
            return await fetch(e.request).then(response => {
                return caches.open(cacheName).then(cache => {
                    // console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    if (!e.request.url.startsWith("chrome-extension") && e.request.method != "POST") {
                        cache.put(e.request, response.clone());
                    }
                    return response;
                });
            });
        } catch (err) {
            return caches.match(e.request);
        }
    }());
});

self.addEventListener('push', function (event) {
    var data = event.data.json();

    const title = data.Title;
    var shortContent = data.ShortContent
    var buttonTitle = data.ButtonTitle
    var sendDate = data.sendDateString

    var options = {
        body: shortContent,
        icon: "assets/icons/icon-72x72.png",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
        },
        actions: [
            {
                action: "explore", title: buttonTitle
            },
            {
                action: "close", title: "بستن"
            },
        ],
        dir: "rtl",
        image: "assets/icons/icon-512x512.png",
        lang: "fa",
        tag: data.id,
        renotify: true
    };

    const promiseChain = self.registration.showNotification(title, options);

    event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', function (event) {
    var urlToOpen = new URL("/#/more/notifications", self.location.origin).href;

    if (event.action == 'close') {
        return event.notification.close();
    }

    if (event.action == "update") {

        var url = new URL("/#/", self.location.origin).href;

        return event.waitUntil(
            clients.openWindow(url)
        );
    }

    event.notification.close();

    event.waitUntil(
        clients.matchAll({
            type: "window"
        }).then(function (clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url == urlToOpen && 'focus' in client)
                    return client.focus();
            }
            if (clients.openWindow)
                return clients.openWindow(urlToOpen);
        })
    );
});

self.addEventListener("sync", (e) => {


    if (e.tag == "NotiAndChat") {
        e.waitUntil(checkForNewNotiAndChat());
    }


})

function checkForNewNotiAndChat() {

    return getStudent().then((student) => {
        if (student) {

            getToken().then((token) => {

                if (token) {

                    getApiUrl().then((apiUrl) => {
                        if (apiUrl) {

                            fetch(
                                postRequest(serializeUrl("/api/Ticket/getUnreadTicketsCount", apiUrl), token, {
                                    id: student.id,
                                    type: 1
                                })
                            ).then(response => {
                                return response.json();
                            }).then(data => {
                                if (data.success) {
                                    var unReadTicketsCount = data.data;

                                    if (unReadTicketsCount != 0) {
                                        showNotification("تیکت جدید", "شما " + unReadTicketsCount + " تیکت خوانده نشده دارید!", "unread-tickets");
                                    }
                                }
                            });

                            fetch(
                                postRequest(serializeUrl("/api/MobileChat/getUnreadChatCount", apiUrl), token, {
                                    id: student.id,
                                    type: 0
                                })
                            ).then(response => {
                                return response.json();
                            }).then(data => {
                                if (data.success) {
                                    var unReadChatCount = data.data;

                                    if (unReadChatCount != 0) {
                                        showNotification("چت جدید", "شما " + unReadChatCount + " چت دیده نشده دارید!", "unread-chats");
                                    }
                                }
                            });

                        }
                    })
                }

            })
        }
    })
}

function showNotification(title, content, tag) {
    var options = {
        body: content,
        icon: "assets/icons/icon-72x72.png",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
        },
        actions: [
            {
                action: "explore", title: "جزئیات بیشتر"
            },
            {
                action: "close", title: "بستن"
            },
        ],
        dir: "rtl",
        lang: "fa",
        tag: tag,
        renotify: true
    };

    self.registration.showNotification(title, options);
}

function getStudent() {
    return new Promise((resolve, reject) => {
        var req = indexedDB.open("main");

        req.onsuccess = (e) => {
            var db = e.target.result;

            var tx = db.transaction(["student"], "readonly");
            var obj = tx.objectStore("student");

            obj.getAll().onsuccess = (e) => {
                var students = e.target.result;

                resolve(students[0]);
            }
        }
    });
}

function postRequest(url2, token, data = null) {

    let content = JSON.stringify(data);

    return new Request(url2, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: content,
        method: "POST"
    });
}

function getApiUrl() {
    return new Promise((resolve, reject) => {
        var req = indexedDB.open("main");

        req.onsuccess = (e) => {
            var db = e.target.result;

            var tx = db.transaction(["api"], "readonly");
            var obj = tx.objectStore("api");

            obj.getAll().onsuccess = (e) => {
                var apis = e.target.result;

                resolve(apis[0]);
            }
        }
    })
}

function serializeUrl(url, apiUrl) {
    var url2 = url.replace("/api/", apiUrl);

    return url2;
}

function getToken() {
    return new Promise((resolve, reject) => {
        var req = indexedDB.open("main");

        req.onsuccess = (e) => {
            var db = e.target.result;

            var tx = db.transaction(["token"], "readonly");
            var obj = tx.objectStore("token");

            obj.getAll().onsuccess = (e) => {
                var tokens = e.target.result;

                resolve(tokens[0]);
            }
        }
    });
}

const output = {}

let encryptValue, decryptValue, encryptObject, decryptObject

const decrypt = (pw, algo, enc) => (value) => {
    const decipher = crypto.createDecipher(algo, pw)

    return JSON.parse(decipher.update(value, enc, 'utf8') +
        decipher.final('utf8'))
}

const encrypt = (pw, algo, enc) => (value) => {
    const cipher = crypto.createCipher(algo, pw)

    return cipher.update(JSON.stringify(value), 'utf8', enc) +
        cipher.final(enc)
}

function cryptFunction(type) {
    return function (object, keys, isArray) {
        const cryptValue = (type === 'encrypt') ? encryptValue : decryptValue
        const cryptObject = (type === 'encrypt') ? encryptObject : decryptObject
        const output = isArray ? object.map(e => e) : Object.assign({}, object)
        const length = isArray ? object.length : keys.length

        if (keys.length === 0) {
            for (let i = 0, len = Object.keys(object).length; i < len; i++) {
                const key = isArray ? i : Object.keys(object)[i]

                if (typeof object[key] !== 'undefined') {
                    output[key] = object[key]

                    if (typeof object[key] !== 'object') {
                        output[key] = cryptValue(object[key])
                    } else if (Array.isArray(object[key])) {
                        output[key] = cryptObject(object[key], keys, true)
                    } else {
                        output[key] = cryptObject(object[key], keys)
                    }
                }
            }

            return output
        }

        for (let i = 0; i < length; i++) {
            const key = isArray ? i : keys[i]

            if (typeof object[key] !== 'undefined') {
                output[key] = object[key]

                if (typeof object[key] !== 'object') {
                    output[key] = cryptValue(object[key])
                } else if (Array.isArray(object[key])) {
                    output[key] = cryptObject(object[key], keys, true)
                } else {
                    output[key] = cryptObject(object[key], keys)
                }
            }
        }

        return output
    }
}

output.encrypt = function (object, password, config) {
    config = config || {}
    const encoding = config ? (config.encoding || 'hex') : 'hex'
    const algorithm = config ? (config.algorithm || 'aes256') : 'aes256'
    const keys = config.keys || []

    if (!object || typeof object !== 'object' || Array.isArray(object)) {
        throw new Error('First argument must be an object.')
    }

    if (!password) {
        throw new Error('Password is required.')
    }

    encryptValue = encrypt(password, algorithm, encoding)
    encryptObject = cryptFunction('encrypt')
    return encryptObject(object, keys)
}

output.decrypt = function (object, password, config) {
    config = config || {}
    const encoding = config ? (config.encoding || 'hex') : 'hex'
    const algorithm = config ? (config.algorithm || 'aes256') : 'aes256'
    const keys = config.keys || []

    if (!object || typeof object !== 'object' || Array.isArray(object)) {
        throw new Error('First argument must be an object.')
    }

    if (!password) {
        throw new Error('Password is required.')
    }

    decryptValue = decrypt(password, algorithm, encoding)
    decryptObject = cryptFunction('decrypt')
    return decryptObject(object, keys)
}
