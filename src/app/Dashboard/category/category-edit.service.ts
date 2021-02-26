import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { of, EMPTY } from "rxjs";
import { IItem } from "../item/item";
import { take, mergeMap } from "rxjs/operators";
import { ICategory } from "./category";


@Injectable()
export class CategoryEditService implements Resolve<any>{
    constructor(
        private auth: AuthService,
        private message: MessageService,
        private router: Router
    ) { }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id = route.params["id"];

        if (id) {

            if (id == 0) {
                return of(new ICategory()).toPromise();
            }

            return this.auth
                .post("/api/Category/getCategory", id)
                .pipe(
                    take(1),
                    mergeMap((data: jsondata) => {
                        if (data.success) {
                            return of(data.data);
                        } else {
                            this.message.showMessageforFalseResult(
                                data
                            );
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