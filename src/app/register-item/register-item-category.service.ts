import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
} from "@angular/router";
import { Injectable } from "@angular/core";
import { take, mergeMap } from "rxjs/operators";
import { jsondata, AuthService } from "../shared/Auth/auth.service";
import { of, EMPTY } from "rxjs";
import { MessageService } from "../shared/services/message.service";

@Injectable()
export class RegisterItemCategoryService implements Resolve<any> {
    constructor(
        private auth: AuthService,
        private message: MessageService,
        private router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        var id = route.params["id"];
        if (id) {
            return this.auth.post("/api/Category/getCategory", id).pipe(
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
