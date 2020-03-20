import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { take, mergeMap } from "rxjs/operators";
import { of, EMPTY } from "rxjs";


@Injectable()
export class UnitListResolverService implements Resolve<any>{
    constructor(
        private message: MessageService,
        private auth: AuthService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.auth.post("/api/Unit/GetAll", null).pipe(
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