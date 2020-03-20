import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StudentAuthService } from '../../service/parent-student-auth.service';

@Injectable({
    providedIn: 'root'
})
export class MainGuard implements CanActivateChild {

    constructor(
        private stdAuth: StudentAuthService,
        private router: Router
    ) { }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.stdAuth.isLoggedin(true)) {
            return true;
        }

        this.router.navigateByUrl("/login");

        return false;
    }

}
