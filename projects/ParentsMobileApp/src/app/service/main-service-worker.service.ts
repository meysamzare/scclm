import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { StudentAuthService } from './parent-student-auth.service';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
    providedIn: 'root'
})
export class MainServiceWorkerService {

    cacheName = 'js13kMs2PWA-v1';

    swRegistration = null;
    isPushNorificationSubscribed = false;

    newUpdateAvailable$ = new Subject<any>();

    constructor(
        private auth: AuthService,
        private message: MessageService,
        private stdAuth: StudentAuthService
    ) { }

    Install() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register("/main-sw.js", { scope: '/' }).then(swReg => {
                this.swRegistration = swReg;
                // swReg.sync.register("NotiAndChat");
                this.checkSubscription();

                swReg.onupdatefound = () => {
                    const installingWorker = swReg.installing;

                    installingWorker.onstatechange = () => {
                        switch (installingWorker.state) {
                            case 'installed':
                                if (navigator.serviceWorker.controller) {
                                    // new update available
                                    this.newUpdateAvailable$.next();
                                }
                                break;
                        }
                    }
                }
            }).catch(err => {
                console.log("[MAIN-SW] ERROR: " + err);
            });
        }
    }


    checkSubscription() {
        this.swRegistration.pushManager.getSubscription()
            .then(subscription => {
                // console.log(subscription);
                // console.log(JSON.stringify(subscription));
                this.isPushNorificationSubscribed = !(subscription === null);

                if (!this.isPushNorificationSubscribed) {
                    this.subscribe();
                }
            });
    }

    urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    subscribe() {
        this.isPushNorificationSubscribed = true;
        //check the source code to get the method below
        const applicationServerKey = this.urlB64ToUint8Array(this.auth.pushNotificationPublicKeyPMA);
        this.swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        }).then(subscription => {
            // console.log(JSON.parse(JSON.stringify(subscription)));

            var endpoint = subscription.endpoint;
            var key = subscription.getKey('p256dh');
            var auth = subscription.getKey('auth');

            this.sendSubscriptionToServer(endpoint, key, auth);

            this.isPushNorificationSubscribed = true;
        }).catch(err => {
            console.log('Failed to subscribe the user: ', err);
            this.isPushNorificationSubscribed = false;
        });
    }

    sendSubscriptionToServer(endpoint, key, auth) {
        var encodedKey = btoa(String.fromCharCode.apply(null, new Uint8Array(key)));
        var encodedAuth = btoa(String.fromCharCode.apply(null, new Uint8Array(auth)));

        // console.log("Server Subscriibe", encodedKey, encodedAuth);

        this.auth.post("/api/Notification/subscribe", {
            sub: {
                endpoint: endpoint,
                p256DH: encodedKey,
                auth: encodedAuth
            },
            stdId: this.stdAuth.getStudent().id,
            isParent: true
        }, {
            type: 'Add',
            agentId: this.stdAuth.getStudent().id,
            agentType: 'StudentParent',
            agentName: this.stdAuth.getStudentFullName(),
            tableName: 'Add Subscribation To Server',
            logSource: 'PMA',
            object: {
                sub: {
                    endpoint: endpoint,
                    p256DH: encodedKey,
                    auth: encodedAuth
                },
                stdId: this.stdAuth.getStudent().id,
                isParent: true
            }
        }).subscribe(data => {
        }, er => {
            this.auth.handlerError(er);
        });
    }

    unsubscribe() {
        this.isPushNorificationSubscribed = true;
        this.swRegistration.pushManager.getSubscription()
            .then((subscription) => {
                if (subscription) {
                    this.removeSubscriptionFromServer(subscription.endpoint);
                    return subscription.unsubscribe();
                }
            })
            .catch(function (error) {
                console.log('Error unsubscribing', error);
            })
            .then(() => {
                this.isPushNorificationSubscribed = false;
            });
    }

    removeSubscriptionFromServer(endpoint) {
        this.auth.post("/api/Notification/unsubscribe", endpoint, {
            type: 'Delete',
            agentId: this.stdAuth.getStudent().id,
            agentType: 'StudentParent',
            agentName: this.stdAuth.getStudentFullName(),
            tableName: 'Remove Subsctibation From Server',
            logSource: 'PMA',
            deleteObjects: [{
                endPoint: endpoint
            }],
        }).subscribe(data => {
        }, er => {
            this.auth.handlerError(er);
        });
    }

    sendBrodcastToServer(title, message, url) {
        this.auth.post("/api/Notification/broadcast", {
            message: message,
            url: url,
            title: title
        }).subscribe(data => {
        }, er => {
            this.auth.handlerError(er);
        });
    }

    toggleSubscription() {
        if (this.isPushNorificationSubscribed) {
            this.unsubscribe();
        } else {
            this.subscribe();
        }
    }

    addUrlToCache(url) {
        caches.open(this.cacheName).then(cache => {
            cache.add(url);
        });
    }

    getRegisteration() {
        return navigator.serviceWorker.getRegistration();
    }

    showNotification(title, content, action?) {
        this.getRegisteration().then(reg => {
            var options: NotificationOptions = {
                body: content,
                icon: 'assets/icons/icon-72x72.png',
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 1
                },
                actions: [
                    {
                        action: action ? action : 'explore', title: 'جزئیات بیشتر'
                    },
                    {
                        action: 'close', title: 'بستن'
                    },
                ],
                dir: "rtl",
                lang: "fa"
            };
            reg.showNotification(title, options);
        })
    }

}