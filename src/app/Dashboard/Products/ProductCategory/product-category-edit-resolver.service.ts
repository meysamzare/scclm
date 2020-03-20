import { Injectable } from '@angular/core';
import { IProductCategory } from './product-category';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { of, EMPTY } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductCategoryEditResolverService implements Resolve<any> {
    PAGE_APIURL = "ProductCategory";

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

                return of(new IProductCategory()).toPromise();
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
