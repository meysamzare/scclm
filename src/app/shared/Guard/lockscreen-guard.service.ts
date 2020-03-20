import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService } from "../Auth/auth.service";

@Injectable()
export class LockScreenGuardService implements CanActivate {

    constructor(private auth: AuthService, private router: Router){}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (!this.auth.isUserLocked()) {
            this.router.navigate(['/dashboard']);
            return false;
        }
        return true;
    }
}
