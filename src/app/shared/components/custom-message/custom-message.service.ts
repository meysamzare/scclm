import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ICustomMessage } from './custom-message';

@Injectable({
    providedIn: 'root'
})
export class CustomMessageService {

    private _customMessage = new Subject<ICustomMessage>();

    public messageAdded = this._customMessage.asObservable();

    public clearAll$ = new Subject();

    public add(custom: ICustomMessage) {
        this._customMessage.next(custom);
    }

    public clearAll() {
        this.clearAll$.next();
    }

    constructor() { }
}
