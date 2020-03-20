import { Component, OnInit, Input, Directive, ContentChildren, QueryList, TemplateRef, Output, EventEmitter } from '@angular/core';
import { NavbarService } from './navbar.service';
import { ThemeService } from '../../shared/services/theme.service';
import { LocationService } from '../../shared/services/location.service';

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
    @Input() showSidebarToggleButton = true;
    @Input() showTitle = true;
    @Input() Title = "";

    @Output("refresh") refresh$ = new EventEmitter<any>();

    @ContentChildren(NavbarItemDirective) public items: QueryList<NavbarItemDirective>;

    constructor(
        public navbar: NavbarService,
        public themeSrv: ThemeService,
        public locationService: LocationService
    ) { }

    ngOnInit() {
        this.navbar.setTitle("پرتال مجتمع آموزشی | " + this.Title);
    }

}

