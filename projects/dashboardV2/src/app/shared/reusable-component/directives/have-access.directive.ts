import { Directive, Input, TemplateRef, ViewContainerRef, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Directive({
    selector: '[haveAccess]'
})
export class HaveAccessDirective {

    role = "";

    @Input()
    set haveAccess(val) {
        this.role = val;
        this.updateView();
    }

    constructor(
        private element: ElementRef,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private auth: AuthService
    ) { }


    private updateView() {
        if (this.auth.isUserAccess(this.role, false)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }

}
