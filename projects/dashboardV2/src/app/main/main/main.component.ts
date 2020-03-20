import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { NavbarService } from '../navbar/navbar.service';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from '../../animations';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    animations: [slideInAnimation]
})
export class MainComponent implements OnInit, OnDestroy {

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    openState = true;

    constructor(
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        public navbar: NavbarService
    ) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this.navbar.isMobile = this.mobileQuery.matches;
        this.mobileQuery.onchange = () => this.navbar.isMobile = this.mobileQuery.matches;
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);

        this.navbar.openStateChange$.subscribe(state => {
            this.openState = state;
        });
    }

    ngOnInit() {
    }


    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    prepareRoute(outlet: RouterOutlet) {
        return false;
    }
    
}
