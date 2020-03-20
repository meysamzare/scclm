import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    themeStorageKey = "_t";

    currentTheme: "dark" | "light" | "default" = null;

    colorChange$ = new Subject<"dark" | "light" | "default">();

    constructor() { }

    setThemeColor(theme: "dark" | "light" | "default" | any, saveTheme = true) {
        // /assets/bulma/default.css
        (document.getElementById("bultheme") as HTMLLinkElement).href = `/assets/bulma/${theme}.css`
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
            this.setThemeColor("default");
        }
    }
}
