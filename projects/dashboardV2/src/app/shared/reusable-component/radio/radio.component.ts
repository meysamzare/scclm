import { Component, OnInit, QueryList, ContentChildren, Input, AfterContentInit, AfterViewInit, ViewChild, Optional, Self, ViewEncapsulation } from '@angular/core';
import { RadioButtonDirective } from './radio-button.directive';
import { IOption } from '../select/select.component';
import { ControlValueAccessor, Validator, AbstractControl, ValidationErrors, NgControl, ValidatorFn, Validators } from '@angular/forms';
import { MatRadioGroup } from '@angular/material';

@Component({
    selector: 'app-radio-group',
    templateUrl: './radio.component.html',
    styleUrls: ['./radio.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RadioComponent implements OnInit, AfterViewInit, AfterContentInit, ControlValueAccessor, Validator {

    options: IOption[] = [];

    @ContentChildren(RadioButtonDirective) radioButtons: QueryList<RadioButtonDirective>;

    @ViewChild("radio", { static: false }) radio: MatRadioGroup;

    value = null;

    @Input() label = "";
    @Input() hint = "";
    @Input() disabled = false;
    @Input() showLabelSection = true;
    @Input() required = true;
    @Input() InvalidMessage = "";

    constructor(
        @Optional() @Self() public controlDir: NgControl
    ) {
        if (controlDir) {
            this.controlDir.valueAccessor = this;
        }
    }

    writeValue(obj: any): void {
        // if (this.radio) {
        //     this.radio.writeValue(obj);
        // }

        this.value = obj;
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
    validate(control: AbstractControl): ValidationErrors {
        const validators: ValidatorFn[] = [];
        if (this.required) {
            validators.push(Validators.required);
        }

        return validators;
    }

    onChange(value) { }
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
    }

    ngAfterContentInit(): void {
        this.radioButtons.forEach(rbutton => {
            this.options.push({
                label: rbutton.label,
                value: rbutton.value,
                disabled: rbutton.disabled
            });
        });
    }

    ngAfterViewInit(): void {
        // if (this.radio) {
        //     this.radio.registerOnTouched(() => this.onTouched());
        // }
    }

    ngOnInit() {
        if (this.controlDir) {

            const control = this.controlDir.control;
            const validators: ValidatorFn[] = control.validator ? [control.validator] : [];
            if (this.required) {
                validators.push(Validators.required);
            }

            control.setValidators(validators);
            control.updateValueAndValidity();
        }
    }

}
