import { Component, OnInit, Input, ViewChild, ElementRef, Self, Optional } from '@angular/core';
import { ControlValueAccessor, Validator, AbstractControl, ValidationErrors, ValidatorFn, Validators, NgControl } from '@angular/forms';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit, ControlValueAccessor, Validator {

    @ViewChild('input', { static: true }) input: ElementRef;

    @Input() type: string = "text";
    @Input() label: string;
    @Input() showLabelSection: boolean = true;
    @Input() Size: "small" | "normal" | "medium" | "large" = "normal";
    @Input("placeholder") Placeholder: string = "";
    @Input() InvalidMessage: string = "";
    @Input() Rounded: boolean = false;
    @Input() Loading: boolean = false;
    @Input() disabled: boolean = false;
    @Input() readonly: boolean = false;

    @Input() required: boolean = true;
    @Input() pattern: string = null;

    constructor(
        @Optional() @Self() public controlDir: NgControl
    ) {
        if (controlDir) {
            this.controlDir.valueAccessor = this;
        }
    }

    ngOnInit() {
        if (this.controlDir) {

            const control = this.controlDir.control;
            const validators: ValidatorFn[] = control.validator ? [control.validator] : [];
            if (this.required) {
                validators.push(Validators.required);
            }
            if (this.type == "email") {
                validators.push(Validators.email);
            }
            if (this.pattern) {
                validators.push(Validators.pattern(this.pattern));
            }

            control.setValidators(validators);
            control.updateValueAndValidity();
        }

    }

    canShowClearButton(): boolean {
        if (this.controlDir) {
            if (this.controlDir.value && !this.Loading) {
                return true;
            }
        }

        return false;
    }

    clearValue() {
        this.controlDir.reset();
    }


    writeValue(obj: any): void {
        this.input.nativeElement.value = obj;
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onChange(event) { }

    onTouched() { }

    isValid(): boolean {
        if (this.controlDir) {
            return this.controlDir.control.valid;
        }

        return true;
    }

    getInvalidMessage() {
        if (this.InvalidMessage) {
            return this.InvalidMessage;
        }

        if (this.controlDir.control.hasError("required")) {
            return `وارد کردن ${this.label} الزامی است`;
        }

        if (this.controlDir.control.hasError("pattern") || this.controlDir.control.hasError("email")) {
            return `${this.label} را به درستی وارد کنید`;
        }
    }

    validate(c: AbstractControl): ValidationErrors {
        const validators: ValidatorFn[] = [];
        if (this.required) {
            validators.push(Validators.required);
        }
        if (this.type == "email") {
            validators.push(Validators.email);
        }
        if (this.pattern) {
            validators.push(Validators.pattern(this.pattern));
        }

        return validators;
    }

}
