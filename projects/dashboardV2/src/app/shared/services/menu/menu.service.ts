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
        let menuWithChild: IMenu[] = [];

        this.menus.forEach(menu => {
            menuWithChild.push(menu);

            menu.childrens.forEach(childMenu => menuWithChild.push(childMenu));
        });

        let menu = menuWithChild.find(c => c.link == url);

        if (menu) {
            return menu;
        }

        throw new Error("Menu by link not Found! Please report it to owner.");
    }

    getMenuByApiUrl(url: string) {
        let menuWithChild: IMenu[] = [];

        this.menus.forEach(menu => {
            menuWithChild.push(menu);

            menu.childrens.forEach(childMenu => menuWithChild.push(childMenu));
        });

        let menu = menuWithChild.find(c => c.apiUrl == url);

        if (menu) {
            return menu;
        }

        throw new Error("Menu by api not Found! Please report it to owner.");
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
        url = url.replace(new RegExp("\/edit\/.*", "gi"), "").replace("/list", "").split("?")[0];

        return this.getMenu(url);
    }

    getCurrentPureUrl() {
        return this.getPureUrlMenu(this.router.url);
    }
}


export interface IMenu {
    title: string;

    titles?: string;

    icon: string;

    desc: string;

    link: string;
    apiUrl?: string;

    exactLink?: boolean;

    childrens?: IMenu[];
    

    role?: string;
}