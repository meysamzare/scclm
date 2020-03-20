import { Injectable } from "@angular/core";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { IItemAttr } from "./item-attr";
import { of, EMPTY } from "rxjs";
import { take, mergeMap } from "rxjs/operators";



@Injectable()
export class ItemAttrResolverService implements Resolve<any>{
    constructor(
        private auth: AuthService,
        private message: MessageService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id = route.params["id"];

        if (id) {
            if (id == 0){
                return of(new IItemAttr());
            }
            return this.auth.post("/api/Item/getItemAttr", id).pipe(
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
            );
        } else {
            this.router.navigate(["/"]);
            return EMPTY;
        }
    }
}