import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { CategoryAuthorizeState } from 'src/app/Dashboard/category/category';

@Injectable({
    providedIn: 'root'
})
export class RegisterItemLoginService {

    pss = "HSH^@#&%  BBBSA+=sadh.333";
    key = "icatreg";

    constructor() { }

    getLoginToken(catId: number): RegisterItemToken | null {

        if (this.isUserAccessToCat(catId)) {
            return this._getTokens().find(c => c.categoryId == catId);
        }

        return null;
    }

    isUserAccessToCat(catId: number): boolean {
        let tokens = this._getTokens();

        let catToken = tokens.find(c => c.categoryId == catId);

        if (catToken) {
            return catToken.dateExpire < new Date() || !catToken.jwtToken ? false : true;
        }

        return false;
    }
    

    addToken(token: RegisterItemToken) {
        let tokens = this._getTokens();

        let catToken = tokens.find(c => c.categoryId == token.categoryId);

        if (catToken) {
            tokens.splice(tokens.findIndex(c => c == catToken), 1);
        }

        tokens.push(token);

        this._setTokens(tokens);
    }

    removeToken(catId: number) {
        let tokens = this._getTokens();

        let catToken = tokens.find(c => c.categoryId == catId);

        if (catToken) {
            tokens.splice(tokens.findIndex(c => c == catToken), 1);
        }

        this._setTokens(tokens);
    }


    private _setTokens(tokens: RegisterItemToken[]) {
        let textToEncript = JSON.stringify(tokens);

        let encriptedText = this._encript(textToEncript);

        localStorage.setItem(this.key, encriptedText);
    }
    
    private _getTokens(): RegisterItemToken[] {
        let encTokens = localStorage.getItem(this.key);

        if (encTokens) {
            return JSON.parse(this._decript(encTokens));
        }

        return [];
    }



    private _encript(value: string): string {
        return CryptoJS.AES.encrypt(value, this.pss).toString();
    }

    private _decript(text: string): string {
        return CryptoJS.AES.decrypt(text, this.pss).toString(CryptoJS.enc.Utf8);
    }
}


export class RegisterItemToken {
    username: string;
    userFullName: string;
    userType: CategoryAuthorizeState;

    categoryId: number;

    dateExpire: Date;

    jwtToken: string;
}