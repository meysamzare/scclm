import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class IDBService {

    dbName = "main";
    dbVersion = 5;
    dbStudentStoreName = "student";
    dbTokenStoreName = "token";
    dbUserStoreName = "us";
    dbApiStoreName = "api";
    dbDraftStoreName = "draft";

    db: IDBDatabase;

    constructor() { }

    openDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            var req = indexedDB.open(this.dbName, this.dbVersion);


            req.onupgradeneeded = (e) => {
                var database: IDBDatabase = (e.target as any).result;

                database.createObjectStore(this.dbDraftStoreName, { keyPath: "title", autoIncrement: false });

                var stdstore = database.createObjectStore(this.dbStudentStoreName, { keyPath: "id", autoIncrement: true });

                stdstore.createIndex('idNum', 'idNum', { unique: false });

                database.createObjectStore(this.dbTokenStoreName, { autoIncrement: true });
                database.createObjectStore(this.dbUserStoreName, { autoIncrement: true });
                database.createObjectStore(this.dbApiStoreName, { autoIncrement: true });

            };

            req.onerror = (e) => {
                reject(e);
            }

            req.onsuccess = () => {
                this.db = req.result;

                resolve(this.db);
            }

        })

    }

    getObjectStore(store_name: string = this.dbStudentStoreName, mode: "readonly" | "readwrite" = "readwrite"): Promise<IDBObjectStore> {
        return new Promise((resolve, reject) => {
            this.openDB().then((db) => {

                var tx = db.transaction([store_name], mode);
                var obj = tx.objectStore(store_name);

                resolve(obj);
            });
        });
    }
}