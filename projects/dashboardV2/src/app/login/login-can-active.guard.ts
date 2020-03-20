import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class LoginCanActiveGuard implements CanActivate {

    constructor(
        private auth: AuthService,
        private router: Router
    ) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        let isLoggedIn = this.auth.isUserLoggedinGuard();

        if (isLoggedIn) {
            this.router.navigateByUrl("/");
        }

        return !isLoggedIn;
    }
}
