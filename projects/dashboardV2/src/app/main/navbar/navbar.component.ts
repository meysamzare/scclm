import { Component, OnInit, Input, Directive, ContentChildren, QueryList, TemplateRef, Output, EventEmitter } from '@angular/core';
import { NavbarService } from './navbar.service';
import { ThemeService } from '../../shared/services/theme.service';
import { LocationService } from '../../shared/services/location.service';
import { MenuService } from '../../shared/services/menu/menu.service';
import { interval } from 'rxjs/internal/observable/interval';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { take } from 'rxjs/internal/operators/take';

@Directive({
    selector: '[navItem]'
})
export class NavbarItemDirective {
    constructor(
        public tempRef: TemplateRef<any>
    ) { }
}

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    @Input() showColorButton = false;
    @Input() showRefresh = false;
    @Input() showBackNavigate = false;
    @Input() showSidebarToggleButton = true;
    @Input() showTitle = true;
    @Input() Title = "";

    @Output("refresh") refresh$ = new EventEmitter<any>();

    @ContentChildren(NavbarItemDirective) public items: QueryList<NavbarItemDirective>;

    constructor(
        public navbar: NavbarService,
        public themeSrv: ThemeService,
        public locationService: LocationService,
        private menu: MenuService
    ) { }

    ngOnInit() {
        interval(100).pipe(
            debounceTime(500),
            take(1)
        ).subscribe(() => {
            if (!this.Title) {
                this.Title = this.menu.getCurrentPureUrl().titles;
            }
            this.navbar.setTitle("پرتال آموزشی مبنا | " + this.Title);
        })
    }

}

