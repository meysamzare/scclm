import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class NavbarService {

    state = true;

    openStateChange$ = new Subject<boolean>();

    TITLE = "";

    isMobile = false;

    constructor(
        public title: Title
    ) { }

    opened() {
        this.state = true;
        this.openStateChange$.next(true);
    }

    closed() {
        this.state = false;
        this.openStateChange$.next(false);
    }

    toggleNavbar() {
        this.state = !this.state;
        this.openStateChange$.next(this.state);
    }

    setTitle(title: string) {
        this.TITLE = title;
        this.title.setTitle(title);
    }
}
