import { Directive, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
    selector: 'app-menu-list-item'
})
export class MenuListItemDirective {

    @Input() role: string = "";
    @Input() title: string = "";
    @Input() link: string = "";
    @Input() exact: boolean = false;

    constructor(
        private router: Router
    ) { }

    @HostListener('click')
    public onClick(){
        if (this.link) {
            this.router.navigateByUrl(this.link);
        }
    }

    isActiveRoute(): boolean {
        if (this.link && this.router) {
            return this.router.isActive(this.link, this.exact)
        }

        return false;
    }

}
