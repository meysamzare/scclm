import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MainService {

    mainDivScrollTop$ = new Subject<any>();

    constructor() { }

    onMainDivScrollTop(event?) {
        this.mainDivScrollTop$.next(event);
    }
}
