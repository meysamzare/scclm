import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService, jsondata } from "../shared/Auth/auth.service";
import { MessageService } from "../shared/services/message.service";
import { take, mergeMap } from "rxjs/operators";
import { of, EMPTY } from "rxjs";



@Injectable()
export class InfoItemResolverService implements Resolve<any> {
    constructor(
        private auth: AuthService,
        private message: MessageService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        var id = route.params["rahcode"];
        if (id) {
            return this.auth.post("/api/Item/getItemByRahCode", id).pipe(
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