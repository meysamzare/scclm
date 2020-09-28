import { Injectable } from '@angular/core';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { of, EMPTY } from 'rxjs';
import { IWriter } from '../Products/Writer/writer';
import { take, mergeMap } from 'rxjs/operators';
import { IOnlineClass } from './online-class';

@Injectable({
  providedIn: 'root'
})
export class OnlineClassResolverService implements Resolve<any> {
    PAGE_APIURL = "OnlineClass";

    constructor(
        private auth: AuthService,
        private message: MessageService,
        private router: Router
    ) { }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id = route.params["id"];

        if (id) {
            if (id == 0) {

                if (await this.auth.draft.isAnyDraft(this.PAGE_APIURL)) {
                    return JSON.parse((await this.auth.draft.getDraft(this.PAGE_APIURL)).value);
                }

                return of(new IOnlineClass()).toPromise();
            }

            return this.auth.post("/api/" + this.PAGE_APIURL + "/get" + this.PAGE_APIURL, id).pipe(
                take(1),
                mergeMap((data: jsondata) => {
                    if (data.success) {
                        return of(data.data);
                    } else {
                        this.message.showMessageforFalseResult(data);
                        this.router.navigate(["/"]);
                        return EMPTY;
                    }
                })
            ).toPromise();
        } else {
            this.router.navigate(["/"]);
            return EMPTY.toPromise();
        }
    }
}
