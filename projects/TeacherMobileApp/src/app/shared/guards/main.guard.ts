import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TeacherAuthService } from '../../services/teacher-auth.service';

@Injectable({
    providedIn: 'root'
})
export class MainGuard implements CanActivateChild {

    constructor(
        private tchAuth: TeacherAuthService,
        private router: Router
    ) { }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
            if (this.tchAuth.isLoggedin(true)) {
                return true;
            }

            this.router.navigateByUrl("/login");
            return false;
    }

}
