import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, Optional, Self } from '@angular/core';
import { ControlValueAccessor, Validator, AbstractControl, ValidationErrors, NgControl, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
    selector: 'app-file',
    templateUrl: './file.component.html',
    styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit, ControlValueAccessor, Validator {

    @ViewChild('input', { static: true }) input: ElementRef;

    @Input() label: string;
    @Input() showLabelSection: boolean = true;
    @Input() Size: "small" | "normal" | "medium" | "large" = "normal";
    @Input() InvalidMessage: string = "";
    @Input() disabled: boolean = false;
    @Input() required: boolean = true;
    @Input() returnBinery: boolean = false;
    @Input() hint = "";
    @Input() sizeLimit_MB = 5;

    @Input() fileUrl = "";

    @Input() accept = "*";


    @Output() fileChange = new EventEmitter<IFileInputReturn>();

    fileName = "";

    constructor(
        @Optional() @Self() public controlDir: NgControl,
        public auth: AuthService
    ) {
        if (controlDir) {
            this.controlDir.valueAccessor = this;
        }
    }

    writeValue(obj: any): void {
        this.input.nativeElement.value = null;
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
        
        if (this.required && !this.fileUrl) {
            validators.push(Validators.required);
        }

        return validators;
    }
    onChange(value: IFileInputReturn) { }
    onTouched() { }

    onFileChange(files: File[]) {

        if (files.length != 0) {
            let file = files[0];

            this.fileName = file.name;

            if (file.size / 1024 / 1024 > this.sizeLimit_MB) {
                this.reset();
                let limitText = `حجم فایل باید کمتر از ${this.sizeLimit_MB} مگابایت باشد!`
                return this.auth.message.showWarningAlert(limitText);
            }


            let returnObj: IFileInputReturn = {
                value: file,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type
            };

            if (this.returnBinery) {
                this.onChange(returnObj);
                this.fileChange.next(returnObj);
                return;
            } else {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (e: ProgressEvent) => {
                    let result = reader.result.toString().split(",")[1];

                    returnObj.value = result;

                    this.onChange(returnObj);
                    this.fileChange.next(returnObj);
                    return;
                };
            }
        } else {
            this.reset();
        }

    }

    reset() {
        this.fileName = "";
        this.onChange(null);
        this.fileChange.next(null);
        this.input.nativeElement.value = null;
    }

    
    canShowClearButton(): boolean {
        if (this.controlDir) {
            if (this.controlDir.value) {
                return true;
            }
        }

        return false;
    }


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

    ngOnInit() {
        if (this.controlDir) {

            const control = this.controlDir.control;
            const validators: ValidatorFn[] = control.validator ? [control.validator] : [];

            if (this.required && !this.fileUrl) {
                validators.push(Validators.required);
            }

            control.setValidators(validators);
            control.updateValueAndValidity();
        }
    }

}


export interface IFileInputReturn {
    value: File | string,
    fileName: string,
    fileType?: string,
    fileSize?: number
}