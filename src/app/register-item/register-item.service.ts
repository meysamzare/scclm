import { Injectable } from "@angular/core";
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
} from "@angular/router";
import { AuthService, jsondata } from "../shared/Auth/auth.service";
import { MessageService } from "../shared/services/message.service";
import { IAttr } from "../Dashboard/attribute/attribute";
import { mergeMap, take } from "rxjs/operators";
import { Observable, of, EMPTY } from "rxjs";

@Injectable()
export class RegisterItemService implements Resolve<any> {
    attrs: IAttr[] = [];

    constructor(
        private auth: AuthService,
        private message: MessageService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        var id = route.params["id"];
        if (id) {
            return this.auth.post("/api/Attribute/getAttrsForCat_C", id).pipe(
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
