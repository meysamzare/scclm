import { Directive, Input, ContentChildren, QueryList } from '@angular/core';

@Directive({
    selector: '[step]'
})
export class RegisterStepDirective {

    @Input("step") public stepIndex = 0;

    @ContentChildren("attrInput", { descendants: true }) attrInputs: QueryList<any>;

    constructor() { }

    isStepInputsValid() {
        if (this.attrInputs) {
            return this.attrInputs.toArray().every(c => c.isInputValid());
        }

        return false;
    }

    isInputsCompleted() {
        if (this.attrInputs) {
            return this.attrInputs.toArray().every(c => c.isInputHaveValue());
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

    @ContentChildren(RegisterStepDirective, { descendants: true }) steps: QueryList<RegisterStepDirective>;

    constructor() { }

    isActiveStepValid() {
        if (this.steps) {
            const step = this.steps.toArray().find(c => c.stepIndex == this.activeStep);

            if (step) {
                return step.isStepInputsValid();
            }
        }

        return true;
    }

    isStepValid(stepIndex: number) {
        if (this.steps) {
            const step = this.steps.toArray().find(c => c.stepIndex == stepIndex);

            if (step) {
                return step.isStepInputsValid();
            }
        }

        return false;
    }

    isStepCompleted(stepIndex: number) {
        if (this.steps) {
            const step = this.steps.toArray().find(c => c.stepIndex == stepIndex);

            if (step) {
                return step.isInputsCompleted();
            }
        }

        return false;
    }

}