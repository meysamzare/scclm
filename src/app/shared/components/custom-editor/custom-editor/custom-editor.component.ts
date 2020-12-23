import { Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { PictureSelectModalComponent } from 'src/app/html-tools/picture-select-modal/picture-select-modal.component';
import { SpeechRecognitionDialogComponent } from '../speech-recognition-dialog/speech-recognition-dialog.component';

@Component({
    selector: 'app-custom-editor',
    templateUrl: './custom-editor.component.html',
    styleUrls: ['./custom-editor.component.scss']
})
export class CustomEditorComponent implements OnInit, ControlValueAccessor, Validator {

    content = "";

    @Input() label = "";
    @Input() required: boolean = true;
    @Input() disabled: boolean = false;
    @Input() showLabel: boolean = true;
    @Input() showPicSelection: boolean = true;
    
    @Input() data: any = "";

    @Output() dataChange = new EventEmitter<any>();

    constructor(
        private dialog: MatDialog,
        @Optional() @Self() public controlDir: NgControl
    ) {
        if (controlDir) {
            this.controlDir.valueAccessor = this;
        }
    }

    ngOnInit() {
        if (this.data) {
            this.content = this.data;
        }

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

    insertPicture() {
        const dialog = this.dialog.open(PictureSelectModalComponent);

        dialog.afterClosed().subscribe(content => {
            if (content) {
                this.content += content;
            }
        });
    }

    openSPTTDialog() {
        const dialog = this.dialog.open(SpeechRecognitionDialogComponent);

        dialog.afterClosed().subscribe(content => {
            if (content) {
                if (!this.content) {
                    this.content = "";
                }
                this.content += content;
            }
        });
    }


    writeValue(obj: any): void {
        this.content = obj;
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

    
    isValid(): boolean {
        if (this.controlDir) {
            return this.controlDir.control.valid;
        }

        return true;
    }

    registerOnValidatorChange?(fn: () => void): void { }

    onChange(event) { }

    onTouched() { }


}
