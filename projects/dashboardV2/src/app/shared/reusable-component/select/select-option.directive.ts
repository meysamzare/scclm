import { Directive, Input } from '@angular/core';

@Directive({
    selector: 'app-select-option'
})
export class SelectOptionDirective {

    @Input("label") title = "";
    @Input() value: any;
    @Input() disabled = false;

    constructor() { }

}
