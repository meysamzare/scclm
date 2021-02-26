import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
    selector: '[phoneNumber]',
    providers: [{ provide: NG_VALIDATORS, useExisting: PhoneNumberValidatorDirective, multi: true }]
})
export class PhoneNumberValidatorDirective implements Validator {

    @Input("phoneNumber") shouldValidate = false;

    constructor() { }


    validate(control: AbstractControl): ValidationErrors {
        return this.shouldValidate ? validatePhoneNumber(control) : null;
    }

    registerOnValidatorChange?(fn: () => void): void { }

}

export function validatePhoneNumber(control: AbstractControl) {
    const isValid = checkForPhoneNumber(control.value);

    return !isValid ? { 'isPhoneNumber': { value: control.value } } : null;
}

export function checkForPhoneNumber(value: string) {
    return /^(09)\d{9}$/.test(value || "");
}