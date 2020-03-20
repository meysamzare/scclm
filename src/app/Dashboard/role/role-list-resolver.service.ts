import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
} from "@angular/router";
import { RoleClass } from "./role";
import { Injectable } from "@angular/core";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";

import { mergeMap, take } from "rxjs/operators";
import { Observable, of, EMPTY } from "rxjs";

@Injectable()
export class RoleListResolver implements Resolve<RoleClass[]> {
    constructor(
        private message: MessageService,
        private auth: AuthService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.auth.post("/api/Role/GetAll", null).pipe(
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
    }
}
