import { Component, OnInit, ContentChild, Input, Host, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { MenuItemParentService } from './menu-item-parent-service.service';
import { MenuListItemDirective } from './menu-list-item.directive';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit, AfterContentInit {
    
    @ContentChildren(MenuListItemDirective) public menuItems: QueryList<MenuListItemDirective>;
    
    @Input() Show = false;
    @Input() ShowByRole = true;

    isActive = false;

    @Input() title = "";
    @Input() icon = "";
    @Input() link = "";

    constructor(
        private parent: MenuItemParentService,
        private router: Router,
        private auth: AuthService
    ) { }

    ngOnInit() { }

    
    ngAfterContentInit(): void { 
        this.router.events
            .pipe(
                debounceTime(100)
            )
        .subscribe(ev => {
            if (this.haveAnyItemActive()) {
                this.parent.openParent(this.getActiveItemTitle());
            }
        });

        if (this.haveAnyItemActive()) {
            this.setShowState(true);
        }

        let roles = this.menuItems.map(c => c.role);
        // this.ShowByRole = this.auth.isUserAccessGroup(roles);
    }

    setActiveState(active: boolean) {
        this.isActive = active;
    }

    toggleSubMenu() {
        if (this.menuItems) {
            this.parent.openItem(this.title);
        }
    }
    
    toggleShow() {
        this.Show = !this.Show;
    }

    setShowState(show: boolean) {
        this.Show = show;
    }

    haveAnyItemActive(): boolean {
        return this.menuItems.some(item => item.isActiveRoute());
    }

    getActiveItemTitle(): string | null {
        if (this.haveAnyItemActive()) {
            return this.menuItems.find(c => c.isActiveRoute()).title;
        }

        return null;
    }



    isContainsItem(itemTitle): boolean {
        return this.menuItems.some(c => c.title == itemTitle);
    }

}
