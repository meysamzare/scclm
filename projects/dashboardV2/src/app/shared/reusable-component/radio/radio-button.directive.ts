import { Directive, Input } from '@angular/core';

@Directive({
    selector: 'app-radio-button'
})
export class RadioButtonDirective {

    @Input() label = "";
    @Input() value: any;
    @Input() disabled = false;
    
    constructor() { }

}
