import { Injectable } from "@angular/core";
import { IDBService } from "projects/ParentsMobileApp/src/app/service/idb.service";
import { MessageService } from "src/app/shared/services/message.service";


@Injectable({
    providedIn: "root"
})
export class DraftService {

    constructor(
        private idb: IDBService,
        private message: MessageService
    ) { }

    async setDraft(value: IDraft) {
        value.title = value.title.toUpperCase();
        let draftos = await this.idb.getObjectStore(this.idb.dbDraftStoreName);
        let req = draftos.put(value);


        req.onsuccess = (e) => {
            this.message.showSuccessAlert("پیش نویس با موفقیت ذخیره شد");
        }

        req.onerror = (er) => {
            this.message.showWarningAlert("خطا در ذخیره سازی پیش نویس!");
            console.error({ draftError: er });
        }
    }

    async getDraft(title: string): Promise<IDraft> {
        title = title.toUpperCase();
        try {

            const draftos = await this.idb.getObjectStore(this.idb.dbDraftStoreName);

            let draftRequest = draftos.get(title);

            return new Promise((resolve, reject) => {

                draftRequest.onsuccess = async (e) => {
                    let draft = (e.target as any).result;

                    resolve(draft);
                };


                draftRequest.onerror = async (e) => {
                    reject(e);
                };
            });

        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getCount(): Promise<number> {
        const draftos = await this.idb.getObjectStore(this.idb.dbDraftStoreName);

        return new Promise((resolve, reject) => {
            let countReq = draftos.count();

            countReq.onsuccess = (e) => resolve((e.target as any).result);
            countReq.onerror = (er) => reject(0);
        });
    }

    async removeDraft(title: string) {
        title = title.toUpperCase();
        const draftos = await this.idb.getObjectStore(this.idb.dbDraftStoreName);

        draftos.delete(title);
    }

    async isAnyDraft(title: string) {
        title = title.toUpperCase();
        try {
            const draft = await this.getDraft(title);
            if (draft) {
                return true;
            }

            return false;

        } catch (error) {
            return Promise.reject(error);
        }
    }

    async clearAllDrafts() {
        let draftos = await this.idb.getObjectStore(this.idb.dbDraftStoreName);
        let req = draftos.clear();

        return new Promise<boolean>((resolve, reject) => {
            req.onsuccess = (e) => resolve(true);
            req.onerror = (er) => reject(false);
        });
    }



}

export interface IDraft {
    title: string,
    value: string
}