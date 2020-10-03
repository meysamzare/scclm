import { Injectable } from '@angular/core';
import { IItemAttr } from 'src/app/Dashboard/item/item-attr';
import { CategoryAuthorizeState } from 'src/app/Dashboard/category/category';
import { IDBService } from 'projects/ParentsMobileApp/src/app/service/idb.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { IAttr } from 'src/app/Dashboard/attribute/attribute';

@Injectable({
    providedIn: 'root'
})
export class RegisterItemDataService {

    constructor(
        private idb: IDBService,
        private message: MessageService
    ) { }

    async saveRegisterItemData(
        catId: number,
        itemAttrs: IItemAttr[],
        authorizeUsername: string,
        authorizeType: CategoryAuthorizeState,
        activeStep: number,
        files: any[],
        attrs: IAttr[]) {

        let data: IRegisterItemData = {
            catId: catId,
            itemAttrs: itemAttrs,
            authorizeUsername: authorizeUsername,
            authorizeType: authorizeType,
            activeStep: activeStep,
            files: files,
            attrs: attrs
        };

        let registerItemOS = await this.idb.getObjectStore(this.idb.dbRegisterItemStoreName);

        let req = registerItemOS.put(data);

        req.onsuccess = (e) => {
            // this.message.showSuccessAlert("پیش نویس با موفقیت ذخیره شد");
        }

        req.onerror = (er) => {
            this.message.showWarningAlert("خطا در ذخیره سازی پیش نویس!");
            console.error({ draftError: er });
        }
    }

    async getRegisterItemData(catId: number): Promise<IRegisterItemData> {
        try {
            const registerItemOS = await this.idb.getObjectStore(this.idb.dbRegisterItemStoreName);

            let registerItemRequest = registerItemOS.get(catId);

            return new Promise((resolve, reject) => {

                registerItemRequest.onsuccess = async (e) => {
                    let data = (e.target as any).result;

                    resolve(data);
                };


                registerItemRequest.onerror = async (e) => {
                    reject(e);
                };
            });

        } catch (error) {
            return Promise.reject(error);
        }
    }

    
    async removeRegisterItemData(catId: number) {
        const registerItemOS = await this.idb.getObjectStore(this.idb.dbRegisterItemStoreName);

        registerItemOS.delete(catId);
    }

    
    async isAnyData(catId: number) {
        try {
            const data = await this.getRegisterItemData(catId);
            if (data) {
                return true;
            }

            return false;

        } catch (error) {
            return Promise.reject(error);
        }
    }

}

export interface IRegisterItemData {
    catId: number
    itemAttrs: IItemAttr[]
    authorizeUsername: string
    authorizeType: CategoryAuthorizeState
    activeStep: number
    files: any[]
    attrs: IAttr[]
}