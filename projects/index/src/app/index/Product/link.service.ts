import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class LinkService {

    likeKEY = "likpro";
    likePS = "$&GWQV^%#*^  S*$%@#RS%#(**&@33=";

    viewKEY = "viwpro";
    viewPS = "$&GWQV^%#*^  (#BSCHYUSTU%#(**&@33=";

    constructor(
        private auth: AuthService
    ) { }

    isViewed(id: any): boolean {
        let vieweds = this._getViewed();

        let view = vieweds.find(c => c == id);

        if (view) {
            return true;
        }

        return false;
    }

    addViewed(id: any) {

        let vieweds = this._getViewed();

        let view = vieweds.find(c => c == id);

        if (!view) {
            vieweds.push(id);

            this._setViewed(vieweds);
        }
    }

    removeViewed(id: any) {
        let vieweds = this._getViewed();

        let view = vieweds.find(c => c == id);

        if (view) {
            vieweds.splice(vieweds.findIndex(c => c == id), 1)
        }

        this._setViewed(vieweds);
    }


    private _setViewed(ids: any[]) {
        let textToEncript = JSON.stringify(ids);

        let encriptedText = this.auth.encript(textToEncript);

        localStorage.setItem(this.viewKEY, encriptedText);
    }

    private _getViewed(): any[] {
        let datas = localStorage.getItem(this.viewKEY);

        if (datas) {
            return JSON.parse(this.auth.decript(datas));
        }

        return [];
    }

    // -----------------------------------------------------

    isLiked(id: any): boolean {
        let likeds = this._getLiked();

        let like = likeds.find(c => c == id);

        if (like) {
            return true;
        }

        return false;
    }

    addLiked(id: any) {

        let likeds = this._getLiked();

        let like = likeds.find(c => c == id);

        if (!like) {
            likeds.push(id);

            this._setLiked(likeds);
        }
    }

    removeLiked(id: any) {
        let likeds = this._getLiked();

        let like = likeds.find(c => c == id);

        if (like) {
            likeds.splice(likeds.findIndex(c => c == id), 1)
        }

        this._setLiked(likeds);
    }


    private _setLiked(ids: any[]) {
        let textToEncript = JSON.stringify(ids);

        let encriptedText = this.auth.encript(textToEncript);

        localStorage.setItem(this.likeKEY, encriptedText);
    }

    private _getLiked(): any[] {
        let datas = localStorage.getItem(this.likeKEY);

        if (datas) {
            return JSON.parse(this.auth.decript(datas));
        }

        return [];
    }


}
