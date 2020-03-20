import { Injectable } from "@angular/core";
import {
    Resolve,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from "@angular/router";
import { IUser } from "./user";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { mergeMap, take } from "rxjs/operators";
import { Observable, of, EMPTY } from "rxjs";

@Injectable()
export class UserResolverService implements Resolve<any> {
    constructor(
        private auth: AuthService,
        private message: MessageService,
        private router: Router
    ) { }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id = route.params["id"];

        if (id) {
            if (id == 0) {

                let title = "user";
                if (await this.auth.draft.isAnyDraft(title)) {
                    return JSON.parse((await this.auth.draft.getDraft(title)).value);
                }

                return of(new IUser()).toPromise();
            }
            return this.auth.post("/api/User/GetUser", id).pipe(
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
