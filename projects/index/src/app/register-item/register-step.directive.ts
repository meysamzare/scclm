import { Directive, Input, ElementRef, ContentChildren, QueryList, ContentChild } from '@angular/core';
import { FormControlName } from '@angular/forms';

@Directive({
    selector: '[step]'
})
export class RegisterStepDirective {

    @Input("step") public attrId = 0;

    @ContentChild(FormControlName) control: FormControlName;

    constructor() { }

    isStepControlValid() {
        if (this.control) {
            if (this.control.disabled) {
                return true;
            }
            
            return this.control.valid;
        }

        return false;
    }

}

@Directive({
    selector: '[registerSteps]',
    exportAs: 'registerSteps'
})
export class StepsDirective {

    @Input("registerSteps") public activeStep = 0;

    @ContentChildren(RegisterStepDirective,  { descendants: true }) steps: QueryList<RegisterStepDirective>;

    constructor() { }

    isActiveStepValid() {
        if (this.steps) {
            let step = this.steps.toArray().find(c => c.attrId == this.activeStep);

            if (step) {
                return step.isStepControlValid();
            }
        }

        return false;
    }

}