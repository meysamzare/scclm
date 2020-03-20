import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    themeStorageKey = "_t";

    currentTheme: "dark" | "light" | "default" = null;

    colorChange$ = new Subject<"dark" | "light" | "default">();

    constructor() { }

    setThemeColor(theme: "dark" | "light" | "default" | any, saveTheme = true) {
        (document.getElementById("bttheme") as HTMLLinkElement).href = `/assets/css/bootstrap/${theme}/bootstrap.min.css`
        this.colorChange$.next(theme);
        if (saveTheme) {
            this.currentTheme = theme;
            localStorage.setItem(this.themeStorageKey, theme);
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    setCurrentTheme() {
        var storeTheme = localStorage.getItem(this.themeStorageKey);

        if (storeTheme) {
            this.setThemeColor(storeTheme);
        } else {
            this.setThemeColor("light");
        }
    }
}