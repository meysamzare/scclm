import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MenuItemParentService {

    openItem$ = new Subject<string>();
    openParent$ = new Subject<string>();


    constructor() { }

    openItem(title) {
        this.openItem$.next(title);
    }

    openParent(title) {
        this.openParent$.next(title);
    }

    getItemListParentTitle(itemTitle) {

    }
}
