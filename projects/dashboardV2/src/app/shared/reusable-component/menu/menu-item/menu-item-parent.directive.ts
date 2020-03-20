import { Directive, ContentChildren, QueryList } from '@angular/core';
import { MenuItemComponent } from './menu-item.component';
import { MenuItemParentService } from './menu-item-parent-service.service';

@Directive({
    selector: 'app-menu-item-parent'
})
export class MenuItemParentDirective {

    @ContentChildren(MenuItemComponent) public menuItems: QueryList<MenuItemComponent>;

    constructor(
        private service: MenuItemParentService
    ) {
        this.service.openItem$.subscribe(title => {
            this.openItem(title);
        });

        this.service.openParent$.subscribe(itemTitle => {
            var title = this.getParentTitle(itemTitle);
            if (title) {
                this.openItem(title, true);
            }
        });
    }

    openItem(title: string, forceOpen = false) {
        this.menuItems.forEach(item => {
            if (item.title == title) {
                if (forceOpen) {
                    item.setShowState(true);
                } else {
                    item.toggleShow();
                }
            } else {
                if (item) {
                    item.setShowState(false);
                }
            }
        });
    }

    getParentTitle(itemTitle): string | null {
        let title: string = null;

        this.menuItems.forEach(item => {
            if (item) {
                if (item.isContainsItem(itemTitle)) {
                    title = item.title;
                    return;
                }
            }
        });

        return title;
    }

}
