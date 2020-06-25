import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { of, EMPTY } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { MenuService } from '../../../services/menu/menu.service';

@Injectable({
    providedIn: 'root'
})
export class DataEditResolverService implements Resolve<any> {

    constructor(
        private auth: AuthService,
        private message: MessageService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private menu: MenuService
    ) {
    }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id = route.params["id"];
        let apiUrl = route.data["apiUrl"]

        if (id) {
            if (id == 0) {

                if (await this.auth.draft.isAnyDraft(apiUrl)) {
                    return JSON.parse((await this.auth.draft.getDraft(apiUrl)).value);
                }

                return of(route.data["newData"]).toPromise();
            }

            let url = `/api/${apiUrl}/get${apiUrl}`;

            return this.auth.post(url, id).pipe(
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
