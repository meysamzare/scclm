import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TeacherAuthService } from '../../services/teacher-auth.service';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {

    
    constructor(
        private tchAuth: TeacherAuthService,
        private router: Router
    ) { }


    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
            if (!this.tchAuth.isLoggedin(true)) {
                return true;
            }

            this.router.navigateByUrl("/");
            return false;
    }

}
