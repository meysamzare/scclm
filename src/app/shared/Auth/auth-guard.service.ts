import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from "@angular/router";
import { AuthService } from "./auth.service";


@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {


    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let isUserLoggedin = this.auth.isUserLoggedin();

        if (!isUserLoggedin) {
            this.auth.redirectUrl = state.url;
            this.router.navigate(['/login']);
            return false;
        } else {
            return true;
        }
    }


    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let isUserLoggedin = this.auth.isUserLoggedin();

        if (!isUserLoggedin) {
            this.auth.redirectUrl = state.url;
            this.router.navigate(['/login']);
            return false;
        }
        else {
            return true;
        }
    }
}