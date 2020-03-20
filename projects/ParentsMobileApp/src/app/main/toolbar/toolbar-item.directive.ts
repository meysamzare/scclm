import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: "app-toolbar-item-left"
})
export class ToolbarItemLeftDirective { }

@Directive({
    selector: "app-toolbar-item-right"
})
export class ToolbarItemRightDirective { }

@Directive({
    selector: "app-toolbar-item-center"
})
export class ToolbarItemCenterDirective { }
