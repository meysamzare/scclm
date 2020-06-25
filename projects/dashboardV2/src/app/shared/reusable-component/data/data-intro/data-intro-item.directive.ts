import { Directive, Input, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: 'app-data-intro-item'
})
export class DataIntroItemDirective {

    @Input() icon = "";
    @Input() title = "";
    @Input() desc = "";

    @Output() onClick = new EventEmitter();
    
    constructor() { }

}
