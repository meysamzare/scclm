import { Directive, Input } from '@angular/core';

@Directive({
    selector: 'app-data-intro-item'
})
export class DataIntroItemDirective {

    @Input() link = "";
    @Input() icon = "";
    @Input() title = "";
    @Input() desc = "";

    constructor() { }

}
