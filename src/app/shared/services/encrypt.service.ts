import { Injectable } from "@angular/core";
import * as CryptoJS from 'crypto-js';


@Injectable({
    providedIn: "root"
})
export class EncryptService {

    pss = "HSHBBBSAsadh333";

    constructor() { }

    encryptObject(obj: any): string {

        console.log({ obj });


        const value = JSON.stringify(obj);

        console.log({ value });

        return this.encrypt(value);
    }

    decryptObject(value: string): any {

        console.log({ value });
        const objString = this.decrypt(value);

        console.log({ objString });

        return JSON.parse(objString);
    }


    // public encrypt(value: string): string {
    //     return CryptoJS.AES.encrypt(value, this.pss).toString(CryptoJS.format.Hex);
    // }

    // public decrypt(text: string): string {
    //     return CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Hex.parse(text) }, this.pss, { format: CryptoJS.format.Hex }).toString();
    //     // return CryptoJS.AES.decrypt(text, this.pss).toString(CryptoJS.enc.Utf8);
    // }

    encrypt(msg, pass = this.pss) {
        var keySize = 256;
        var ivSize = 128;
        var iterations = 100;
        var salt = CryptoJS.lib.WordArray.random(128 / 8);

        var key = CryptoJS.PBKDF2(pass, salt, {
            keySize: keySize / 32,
            iterations: iterations
        });

        var iv = CryptoJS.lib.WordArray.random(128 / 8);

        var encrypted = CryptoJS.AES.encrypt(msg, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC

        });

        // salt, iv will be hex 32 in length
        // append them to the ciphertext for use  in decryption
        var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
        return transitmessage;
    }

    decrypt(transitmessage, pass = this.pss) {
        var keySize = 256;
        var ivSize = 128;
        var iterations = 100;
        var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
        var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
        var encrypted = transitmessage.substring(64);

        var key = CryptoJS.PBKDF2(pass, salt, {
            keySize: keySize / 32,
            iterations: iterations
        });

        var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC

        })
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}