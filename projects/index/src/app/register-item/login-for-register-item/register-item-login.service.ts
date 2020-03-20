import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { CategoryAuthorizeState } from 'src/app/Dashboard/category/category';

@Injectable({
    providedIn: 'root'
})
export class RegisterItemLoginService {

    pass = "HSH^@#&%  BBBSA+=sadh.333";
    key = "icatreg";

    constructor() { }

    getLoginToken(catId: number): RegisterItemToken | null {

        if (this.isUserAccessToCat(catId)) {
            return this.getTokens().find(c => c.categoryId == catId);
        }

        return null;
    }

    isUserAccessToCat(catId: number): boolean {
        let tokens = this.getTokens();

        let catToken = tokens.find(c => c.categoryId == catId);

        if (catToken) {
            return catToken.dateExpire < new Date() || !catToken.jwtToken ? false : true;
        }

        return false;
    }
    

    addToken(token: RegisterItemToken) {
        let tokens = this.getTokens();

        let catToken = tokens.find(c => c.categoryId == token.categoryId);

        if (catToken) {
            tokens.splice(tokens.findIndex(c => c == catToken), 1);
        }

        tokens.push(token);

        this.setTokens(tokens);
    }
    removeToken(catId: number) {
        let tokens = this.getTokens();

        let catToken = tokens.find(c => c.categoryId == catId);

        if (catToken) {
            tokens.splice(tokens.findIndex(c => c == catToken), 1);
        }

        this.setTokens(tokens);
    }
    setTokens(tokens: RegisterItemToken[]) {
        let textToEncript = JSON.stringify(tokens);

        let encriptedText = this.encript(textToEncript);

        localStorage.setItem(this.key, encriptedText);
    }
    getTokens(): RegisterItemToken[] {
        let encTokens = localStorage.getItem(this.key);

        if (encTokens) {
            return JSON.parse(this.decript(encTokens));
        }

        return [];
    }



    encript(value: string): string {
        return CryptoJS.AES.encrypt(value, this.pass).toString();
    }

    decript(text: string): string {
        return CryptoJS.AES.decrypt(text, this.pass).toString(CryptoJS.enc.Utf8);
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