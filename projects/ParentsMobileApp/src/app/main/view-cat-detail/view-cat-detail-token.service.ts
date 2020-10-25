import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class ViewCatDetailTokenService {

    pss = "HSH^@#&% &**^^^ BBBSA+=sadh.333";

    constructor() { }


    getToken(catId: number, itemId: number): string {
        try {

            const object = { catId: catId, itemId: itemId };
            
            const textToEncript = JSON.stringify(object);
            const encriptedText = this._encript(textToEncript);
            
            return encriptedText;
        } catch { return ""; }
    }

    parseToken(token: string): {
        catId: number,
        itemId: number
    } {
        try {

            const object = JSON.parse(this._decript(token));
            
            return {
                catId: object.catId,
                itemId: object.itemId
            };
        } catch { return null }
    }


    
    private _encript(value: string): string {
        return CryptoJS.AES.encrypt(value, this.pss).toString();
    }

    private _decript(text: string): string {
        return CryptoJS.AES.decrypt(text, this.pss).toString(CryptoJS.enc.Utf8);
    }
}
