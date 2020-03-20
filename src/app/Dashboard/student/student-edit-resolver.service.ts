import {
    Resolve,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { of, EMPTY } from "rxjs";
import { take, mergeMap } from "rxjs/operators";
import { IStudent } from "./student";
import { IStudentInfo } from "./studentinfo";

@Injectable()
export class StudentEditResolverService implements Resolve<any> {
    constructor(
        private auth: AuthService,
        private message: MessageService,
        private router: Router
    ) { }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id = route.params["id"];

        if (id) {
            if (id == 0) {

                let title = "student";
                if (await this.auth.draft.isAnyDraft(title)) {
                    return JSON.parse((await this.auth.draft.getDraft(title)).value);
                }

                return of({
                    student: new IStudent(),
                    studentinfo: new IStudentInfo()
                }).toPromise();
            }

            return this.auth.post("/api/Student/getStudent", id).pipe(
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
