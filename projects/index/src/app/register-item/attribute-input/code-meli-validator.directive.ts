import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidationErrors, FormControl } from '@angular/forms';

@Directive({
    selector: '[codeMeli]',
    providers: [{ provide: NG_VALIDATORS, useExisting: CodeMeliValidatorDirective, multi: true }]
})
export class CodeMeliValidatorDirective implements Validator {

    @Input("codeMeli") isMeliCode = false;

    constructor() { }

    validate(control): ValidationErrors | null {
        return this.isMeliCode ? validateMeliCode(control) : null;
    }

}


export function validateMeliCode(control: FormControl) {

    let isValid = checkForMeliCode(control.value || "");

    return !isValid ? { 'meliCode': { value: control.value } } : null;
}

export function checkForMeliCode(input: string) {
    if (!/^\d{10}$/.test(input)
        || input == '0000000000'
        || input == '1111111111'
        || input == '2222222222'
        || input == '3333333333'
        || input == '4444444444'
        || input == '5555555555'
        || input == '6666666666'
        || input == '7777777777'
        || input == '8888888888'
        || input == '9999999999')
        return false;
    let check = parseInt(input[9]);
    let sum = 0;
    let i;
    for (i = 0; i < 9; ++i) {
        sum += parseInt(input[i]) * (10 - i);
    }
    sum %= 11;
    return (sum < 2 && check == sum) || (sum >= 2 && check + sum == 11);
}