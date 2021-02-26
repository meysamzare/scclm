import { Component, OnInit, Optional, Self, Input, EventEmitter, Output } from '@angular/core';
import { NgControl, ControlValueAccessor, Validator, AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IAttr } from 'src/app/Dashboard/attribute/attribute';
import { ICategory } from 'src/app/Dashboard/category/category';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { validateMeliCode } from '../code-meli-validator.directive';

@Component({
    selector: 'app-attribute-input',
    templateUrl: './attribute-input.component.html',
    styleUrls: ['./attribute-input.component.scss']
})
export class AttributeInputComponent implements OnInit, ControlValueAccessor, Validator {

    @Input() disabled = false;
    @Input() readonly = false;

    @Input() isAttributeSingle = false;

    @Input() pattern = null;

    @Input() Category: ICategory = new ICategory();

    @Input() Attribute: any = new IAttr();

    value = null;

    @Output() clearItemAttribute = new EventEmitter<number>();
    @Output() setItemAttribute = new EventEmitter<AttributeInputSaveItemAttributeEvent>();
    @Output() saveItemAttributes = new EventEmitter<any>();

    constructor(
        @Self() @Optional() public controlDir: NgControl,
        private auth: AuthService
    ) {
        if (controlDir) {
            this.controlDir.valueAccessor = this;
        }
    }

    ngOnInit() {
        if (this.controlDir) {
            const control = this.controlDir.control;
            const validators: ValidatorFn[] = control.validator ? [control.validator] : [];
            if (this.Attribute.isRequired) {
                validators.push(Validators.required);
            }
            if (this.Attribute.isMeliCode && (this.Attribute.attrTypeInt == 1 || this.Attribute.attrTypeInt == 2)) {
                validators.push(validateMeliCode);
            }
            if (this.pattern) {
                validators.push(Validators.pattern(this.pattern));
            }
            control.setValidators(validators);
            control.updateValueAndValidity();
        }
    }

    writeValue(obj: any): void {
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

        if (this.Attribute.isRequired) {
            validators.push(Validators.required);
        }
        if (this.Attribute.isMeliCode && (this.Attribute.attrTypeInt == 1 || this.Attribute.attrTypeInt == 2)) {
            validators.push(validateMeliCode);
        }
        if (this.pattern) {
            validators.push(Validators.pattern(this.pattern));
        }

        return validators;
    }

    onChange(event) { }

    onTouched() { }

    isInputValid(): boolean {
        if (this.controlDir.valid && !this.IsUniqValueExist || this.disabled) {
            return true;
        }

        return false;
    }

    isInputHaveValue() {
        if (this.Attribute.isRequired) {
            if (this.controlDir.value) {
                return true;
            }

            return false;
        }

        return true;
    }

    attributeInput(val: any) {

        if (this.disabled) {
            return;
        }

        let value = val;

        if (this.Attribute.attrTypeInt == 3 && value) {
            value = val._d;
        }

        this.onChange(value);

        if (this.Attribute.attrTypeInt == 7 || this.Attribute.attrTypeInt == 8) {
            this.setItemAttrForFile(value);
        } else {
            this.setItemAttr(value);
        }

        this.saveItemAttrs();

        if (this.Attribute.isUniq && !(this.Attribute.attrTypeInt == 4 || this.Attribute.attrTypeInt == 9)) {
            if (this.controlDir && this.controlDir.valid) {
                this.checkForUniqValue(value);
            }
        }
    }

    getAttrPlaceholder(): string {
        if (this.Attribute.placeholder) {
            return this.Attribute.placeholder;
        }

        return this.Attribute.title;
    }

    canShowDesc(): boolean {
        if (this.Attribute.desc) {
            return true;
        }

        return false;
    }

    clearItemAttr() {
        if (this.isAttributeSingle) {
            this.value = null;
            this.attributeInput(null);
        }
        this.clearItemAttribute.emit(this.Attribute.id);
    }

    setItemAttr(value: any) {
        this.setItemAttribute.emit({
            attrId: this.Attribute.id,
            attrValue: value
        });
    }

    fileIsInvalid(message: string) {
        this.clearItemAttr();
        return this.auth.message.showWarningAlert(message);
    }

    _File: File = null;
    setItemAttrForFile(event) {

        const type = this.Attribute.attrTypeInt == 7 ? "pic" : "file";

        let size = type == "file" ? this.Attribute.maxFileSize : 10;
        let sizeText = type == "file" ? `${this.Attribute.maxFileSize} مگابایت` : `10 مگابایت`;

        if (event.target.files && event.target.files.length > 0) {
            let file: File = event.target.files[0];

            let fileExtentions = file.name.split('.');

            if (fileExtentions.length <= 1) {
                this.fileIsInvalid("بارگذاری این فایل مجاز نمی باشد!");
                return;
            }

            Object.defineProperty(file, 'name', {
                writable: true,
                value: `${this.getRandomFileName()}.${fileExtentions.slice(-1)[0]}`
            });

            if (file.size / 1024 / 1024 > size) {
                this.fileIsInvalid("حجم فایل باید کمتر از " + sizeText + " باشد");
                return;
            }

            this._File = file;

            const result = "(binary)";

            this.setItemAttribute.emit({
                attrId: this.Attribute.id,
                attrValue: result,
                File: this._File
            });

            // this.saveItemAttrs();
        } else {
            this.clearItemAttr();
        }
    }

    getRandomFileName(filelength = 10): string {
        let result = "";
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < filelength; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    saveItemAttrs() {
        this.saveItemAttributes.emit();
    }

    canCheckForUniqAttr() {
        if (this.value &&
            this.Attribute.isUniq &&
            !(this.Attribute.attrTypeInt == 4 || this.Attribute.attrTypeInt == 9 || this.Attribute.attrTypeInt == 7 || this.Attribute.attrTypeInt == 8) &&
            this.controlDir.valid
        ) {
            return true;
        }
        return false;
    }

    IsUniqValueExist = false;
    async checkForUniqValue(val?: any) {
        try {
            if (!this.canCheckForUniqAttr()) {
                return;
            }

            const catId = this.Category.id;

            const data = await this.auth.post("/api/Item/CheckForUniqAttr", {
                catId: catId,
                attrId: this.Attribute.id,
                val: val || this.controlDir.value
            }).toPromise();


            if (data.success) {
                this.IsUniqValueExist = true;
            } else {
                this.IsUniqValueExist = false;
            }
        } catch { this.IsUniqValueExist = false; }
    }


    getUniqErrorMessage() {
        if (this.Attribute.uniqErrorMessage) {
            return this.Attribute.uniqErrorMessage;
        }

        return `این فیلد قبلا وارد شده است`;
    }

    getRequiredErrorMessage() {
        if (this.Attribute.requiredErrorMessage) {
            return this.Attribute.requiredErrorMessage;
        }

        return `وارد کردن این فیلد الزامی است`;
    }

}

export class AttributeInputSaveItemAttributeEvent {
    attrId: number;
    attrValue: any;
    File?: File;
}