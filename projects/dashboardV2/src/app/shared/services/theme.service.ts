import { Injectable, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { MediaMatcher } from '@angular/cdk/layout';
import { interval } from 'rxjs/internal/observable/interval';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    darkModeQuery: MediaQueryList;
    private _darkModeQueryListner: () => void;

    themeStorageKey = "_t";
    stateStorageKey = "_st";

    currentTheme: "dark" | "light" | "default" = null;

    colorChange$ = new Subject<"dark" | "light" | "default">();

    themeState: ThemeState = ThemeState.default;

    isSystemOnDarkMode = false;
    
    isNightByTime = false;

    constructor(
        changeDetectorRef: ApplicationRef,
        media: MediaMatcher,
    ) {
        this.darkModeQuery = media.matchMedia('(prefers-color-scheme: dark)');
        this.onSystemThemeChange();
        this.darkModeQuery.onchange = () => {
            this.onSystemThemeChange();
        }
        this._darkModeQueryListner = () => changeDetectorRef.tick();
        this.darkModeQuery.addListener(this._darkModeQueryListner);

        this.detectIsNight();
        // every 10 min
        interval(1000 * 60 * 10).subscribe(() => {
            this.detectIsNight();
        });
    }

    setThemeState(state: ThemeState) {
        localStorage.setItem(this.stateStorageKey, state.toString());
        this.themeState = state;
        this.setThemeByState(false);
    }

    setThemeByState(save = true) {
        let stateStore = localStorage.getItem(this.stateStorageKey);

        let state = 0;

        if (stateStore) {
            state = +stateStore;
        }

        if (save) {
            this.setThemeState(state);
        }

        switch (state) {
            case ThemeState.default:
                this.setThemeColor("default");
                break;
            case ThemeState.dark:
                this.setThemeColor("dark");
                break;
            case ThemeState.autoSystem:
                this.setThemeBySystem();
                break;
            case ThemeState.autoTime:
                this.setThemeByTime();
                break;

            default:
                this.setThemeColor("default");
                break;
        }
    }

    onSystemThemeChange() {
        this.isSystemOnDarkMode = this.darkModeQuery.matches;
        if (this.themeState == ThemeState.autoSystem) {
            this.setThemeBySystem();
        }
    }

    setThemeBySystem() {
        if (this.isSystemOnDarkMode) {
            this.setThemeColor("dark");
        } else {
            this.setThemeColor("default");
        }
    }

    setThemeByTime() {
        if (this.isNightByTime) {
            this.setThemeColor("dark");
        } else {
            this.setThemeColor("default");
        }
    }

    detectIsNight() {
        let hours = new Date().getHours();

        if (hours > 6 && hours < 18) {
            this.isNightByTime = false;
        } else {
            this.isNightByTime = true;
        }
    }

    setThemeColor(theme: "dark" | "light" | "default" | any, saveTheme = true) {
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

    // detectSystemDarkMode() {
    //     if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //         // dark mode
    //         return true;
    //     }
    //     return false;
    // }
}

export enum ThemeState {
    default = 0,
    dark = 1,
    autoSystem = 2,
    autoTime = 3
}