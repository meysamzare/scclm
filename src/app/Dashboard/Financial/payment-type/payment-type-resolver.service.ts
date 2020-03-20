import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { of, EMPTY } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { IPaymentType } from './payment-type';

@Injectable({
    providedIn: 'root'
})
export class PaymentTypeResolverService implements Resolve<any>{

    constructor(
        private auth: AuthService,
        private message: MessageService,
        private router: Router
    ) { }


    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id = route.params["id"];

        if (id) {
            if (id == 0) {


                let title = "paymentType";
                if (await this.auth.draft.isAnyDraft(title)) {
                    return JSON.parse((await this.auth.draft.getDraft(title)).value);
                }

                return of(new IPaymentType()).toPromise();
            }

            return this.auth.post("/api/PaymentType/getPaymentType", id).pipe(
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
