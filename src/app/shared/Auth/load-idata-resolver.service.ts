import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LoadIdataResolverService implements Resolve<any> {

    constructor(
        private auth: AuthService,
        private http: HttpClient
    ) { }


    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.auth.load(this.http, "observable");
    }

    
}
