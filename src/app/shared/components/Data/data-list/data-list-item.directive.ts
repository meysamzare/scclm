import { Directive, Input } from '@angular/core';

@Directive({
    selector: 'data-list-item'
})
export class DataListItemDirective {

    @Input() public Name = "";
    @Input() public Title = "";

    constructor() { }

}

@Directive({
    selector: 'data-list-action-button'
})
export class DataListActionButton {

    @Input() public Name = "";
    @Input() public Title = "";

    constructor() { }

}
