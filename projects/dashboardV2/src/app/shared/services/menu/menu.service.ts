import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    menus: IMenu[] = require("./menu.json");

    constructor(
        private router: Router
    ) { }

    getMenu(url: string) {
        return this.menus.find(c => c.link == url);
    }

    getMenusChild(url: string) {
        return this.menus.find(c => c.link == url).childrens;
    }

    getRootMenus() {
        return this.menus;
    }

    getMenuChildForCurrentUrl() {
        return this.getMenusChild(this.router.url);
    }

    getTitleForCurrentUrl() {
        return this.getCurrentUrlMenu().title;
    }

    getTitlesForCurrentUrl() {
        return this.getCurrentUrlMenu().titles;
    }

    getCurrentUrlMenu() {
        return this.getMenu(this.router.url);
    }

    getPureUrlMenu(url: string) {
        url = url.replace("/edit/0", "").replace("/list", "");

        return this.getMenu(url);
    }
}


export interface IMenu {
    title: string;

    titles?: string;

    icon: string;

    desc: string;

    link: string;

    exactLink?: boolean;

    childrens?: IMenu[];
    

    role?: string;
}