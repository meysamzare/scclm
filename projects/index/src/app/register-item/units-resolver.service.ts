import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { mergeMap } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UnitsResolverService implements Resolve<any> {

    constructor(
        private auth: AuthService,
        private message: MessageService,
        private router: Router
    ) { }

    resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot) {
        return this.auth.post("/api/Unit/getAll").pipe(
            mergeMap(data => {
                if (data.success) {
                    return of(data.data);
                } else {
                    this.message.showMessageforFalseResult(data);
                    this.router.navigate(["/"]);
                    return EMPTY;
                }
            })
        )
    }

}
