import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class MainCanActiveGuard implements CanActivate, CanActivateChild {

    constructor(
        private auth: AuthService,
        private router: Router
    ) { }


    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this._canActiveMain(state);
    }
    canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this._canActiveMain(state);
    }

    private _canActiveMain(state): boolean {
        let isUserLoggedin = this.auth.isUserLoggedin();

        if (!isUserLoggedin) {
            this.auth.redirectUrl = state.url;
            this.router.navigate(['/login']);
            return false;
        } else {
            return true;
        }
    }

}
