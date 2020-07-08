import { Component, OnInit, Optional, Self, Input, EventEmitter, Output } from '@angular/core';
import { NgControl, ControlValueAccessor, Validator, AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { validateMeliCode } from '../../register-item.component';
import { IAttr } from 'src/app/Dashboard/attribute/attribute';
import { IAttributeOption } from 'src/app/Dashboard/attribute/attribute-option';
import { ICategory } from 'src/app/Dashboard/category/category';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
    selector: 'app-attribute-input',
    templateUrl: './attribute-input.component.html',
    styleUrls: ['./attribute-input.component.scss']
})
export class AttributeInputComponent implements OnInit, ControlValueAccessor, Validator {

    @Input() disabled = false;
    @Input() readonly = false;

    @Input() pattern = null;

    @Input() Category: ICategory = new ICategory();

    @Input() Attribute: any = new IAttr();

    value = null;

    @Output() clearItemAttribute = new EventEmitter<number>();
    @Output() setItemAttribute = new EventEmitter<AttributeInputSaveItemAttributeEvent>();
    @Output() saveItemAttributes = new EventEmitter<any>();

    constructor(
        @Self()  @Optional() public controlDir: NgControl,
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
            console.log(this.Attribute);
            if (this.Attribute.isRequired) {
                validators.push(Validators.required);
            }
            if (this.Attribute.isMeliCode) {
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
        console.log(this.Attribute);
        
        if (this.Attribute.isRequired) {
            validators.push(Validators.required);
        }
        if (this.Attribute.isMeliCode) {
            validators.push(validateMeliCode);
        }
        if (this.pattern) {
            validators.push(Validators.pattern(this.pattern));
        }

        return validators;
    }

    onChange(event) { }

    onTouched() { }

    openc(picker) {
        picker.open();
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

    getShiftedItem() {
        let options: IAttributeOption[] = (this.Attribute as any).attributeOptions || [];

        if (this.Category.randomAttributeOption) {
            options = this.shuffleArray(options);
        }

        return options;
    }

    shuffleArray(array: any[]) {

        let shuffled = array
            .map((a) => ({ sort: Math.random(), value: a }))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)

        return shuffled;
    }

    clearItemAttr() {
        this.clearItemAttribute.emit(this.Attribute.id);
    }

    setItemAttr(value) {
        this.setItemAttribute.emit({
            attrId: this.Attribute.id,
            attrValue: value
        });
    }

    _File: File = null;
    IsFileRequiredToEnter = false;
    setItemAttrforPic(event, attrId, type) {

        const fileIsInvalid = (message) => {
            event.target.value = null;
            event.target.files = null;

            this.IsFileRequiredToEnter = true;

            return this.auth.message.showWarningAlert(message);
        }

        this.clearItemAttr();

        let size = type == "file" ? this.Attribute.maxFileSize : 10;
        let sizeText = type == "file" ? `${this.Attribute.maxFileSize} مگابایت` : `10 مگابایت`;

        if (event.target.files && event.target.files.length > 0) {
            let file: File = event.target.files[0];

            let fileExtentions = file.name.split('.');

            if (fileExtentions.length <= 1) {
                fileIsInvalid("بارگذاری این فایل مجاز نمی باشد!");
                return;
            }

            Object.defineProperty(file, 'name', {
                writable: true,
                value: `${this.getRandomFileName()}.${fileExtentions.slice(-1)[0]}`
            });

            if (file.size / 1024 / 1024 > size) {
                fileIsInvalid("حجم فایل باید کمتر از " + sizeText + " باشد");
                return;
            }

            this.IsFileRequiredToEnter = false;

            this._File = file;


            // let itemAttr = this.itemAttrs.find(
            //     c => c.attributeId == attrId
            // );


            // if (itemAttr) {
            //     itemAttr.attrubuteValue = result;
            //     itemAttr.fileName = file.name;
            // } else {
            //     this.itemAttrs.push({
            //         itemId: 0,
            //         attributeId: attrId,
            //         attrubuteValue: result,
            //         attributeFilePath: "1",
            //         fileName: file.name
            //     });
            // }

            let result = "(binery)";

            this.setItemAttribute.emit({
                attrId: this.Attribute.id,
                attrValue: result,
                File: this._File
            });

            this.saveItemAttrs();
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


    IsUniqValueExist = false;
    async checkForUniqValue(val: any, attrId: number) {
        try {
            if (!val) {
                return;
            }

            let catId = this.Category.id;

            let data = await this.auth.post("/api/Item/CheckForUniqAttr", {
                catId: catId,
                attrId: attrId,
                val: val
            }).toPromise();


            if (data.success) {
                this.IsUniqValueExist = true;
            } else {
                this.IsUniqValueExist = false;
            }
        } catch { }
    }


}

export class AttributeInputSaveItemAttributeEvent {
    attrId: number;
    attrValue: any;
    File?: File;
}