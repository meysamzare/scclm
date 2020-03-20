import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[button]'
})
export class ButtonDirective {
    constructor(
        public tempRef: TemplateRef<any>
    ) { }
}
