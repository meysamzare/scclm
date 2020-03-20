import { Injectable } from "@angular/core";
import {
    Resolve,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from "@angular/router";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { of, EMPTY } from "rxjs";
import { ICategory } from "../category/category";
import { take, mergeMap } from "rxjs/operators";
import { IUnit } from "./unit";

@Injectable()
export class UnitEditService implements Resolve<any> {
    constructor(
        private auth: AuthService,
        private message: MessageService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id = route.params["id"];

        if (id) {
            if (id == 0) {
                return of(new IUnit());
            }

            return this.auth.post("/api/Unit/getUnit", id).pipe(
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
