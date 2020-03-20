import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    marginTop = 50;

    constructor(
        private router: ActivatedRoute
    ) {
        // this.router.url.subscribe(url => {

        // })


        // this.router.events.subscribe(event => {
        //     if (
        //         event instanceof NavigationEnd ||
        //         event instanceof NavigationCancel ||
        //         event instanceof NavigationError
        //     ) {
        //         console.log(this.router.getCurrentNavigation());

        //         this.router.getCurrentNavigation().initialUrl.toString().includes("login") ? this.marginTop = 2 : this.marginTop = 50;
        //     }
        // })
    }
}
