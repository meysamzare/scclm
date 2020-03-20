import { Injectable } from "@angular/core";
import { Subject } from "rxjs/internal/Subject";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";


@Injectable({
    providedIn: "root"
})
export class LoaderService {

    changeLoaderState$ = new BehaviorSubject<boolean>(false);
    
    isLoading = this.changeLoaderState$;

    constructor() { }

    setState(state: boolean = true) {
        this.changeLoaderState$.next(state)
    }
    
}