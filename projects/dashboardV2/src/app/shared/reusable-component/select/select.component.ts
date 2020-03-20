import { Component, OnInit, ContentChildren, QueryList, AfterContentInit, Optional, Self, Input, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { SelectOptionDirective } from './select-option.directive';
import { NgControl, ControlValueAccessor, Validator, AbstractControl, ValidationErrors, ValidatorFn, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { MatSelect, ErrorStateMatcher } from '@angular/material';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SelectComponent implements OnInit, AfterViewInit, AfterContentInit, ControlValueAccessor, Validator {

    @Input() label: string;
    @Input() Placeholder: string = "";
    @Input() hint: string = "";
    @Input() disabled = false;
    @Input() showLabelSection = true;
    @Input() required = true;
    @Input() InvalidMessage = "";

    searchText = "";

    options: IOption[] = [];

    @ContentChildren(SelectOptionDirective) private selectOptions: QueryList<SelectOptionDirective>;

    @ViewChild("select", { static: false }) select: MatSelect;

    // matcher = new MyErrorStateMatcher();

    constructor(
        @Optional() @Self() public controlDir: NgControl
    ) {
        if (controlDir) {
            this.controlDir.valueAccessor = this;
        }
    }

    ngAfterViewInit(): void {
        this.select.registerOnTouched(() => { this.onTouched(); return { } });
    }

    ngAfterContentInit(): void {
        this.selectOptions.forEach(option => {
            this.options.push({
                label: option.title,
                value: option.value,
                disabled: option.disabled
            });
        });
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


    getFiltredOptions(): IOption[] {
        let query = this.searchText;

        if (query) {
            return this.options.filter(c => c.label.includes(query));
        }

        return this.options;
    }

    writeValue(obj: any): void {
        if (this.select) {
            this.select.writeValue(obj);
        }
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
    }

}

export interface IOption {
    label: string,
    value: any,
    disabled: boolean
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        console.log({ control: control, form: form });
        return (control && control.invalid);
    }
}