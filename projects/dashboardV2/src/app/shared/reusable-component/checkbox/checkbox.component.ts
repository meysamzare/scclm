import { Component, OnInit, Input, ViewChild, Self, Optional, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, Validator, AbstractControl, ValidationErrors, ValidatorFn, NgControl } from '@angular/forms';
import { MatCheckbox } from '@angular/material';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CheckboxComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator {

    @ViewChild('checkbox', { static: true }) checkbox: MatCheckbox;

    @Input() label: string;
    @Input() desc: string;
    @Input() showLabelSection: boolean = true;
    @Input() disabled: boolean = false;
    @Input() indeterminate: boolean = false;

    constructor(
        @Optional() @Self() public controlDir: NgControl
    ) { 
        if (controlDir) {
            this.controlDir.valueAccessor = this;
        }
    }

    ngAfterViewInit(): void {
        this.checkbox.registerOnTouched(() => this.onTouched());
    }

    writeValue(obj: any): void {
        this.checkbox.writeValue(obj);
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

        return validators;
    }

    onChange(value) { }
    onTouched() { }


    ngOnInit() {
    }

}
