import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { getAttributeTypeString } from 'src/app/Dashboard/attribute/attribute';
import { IAttributeOption } from 'src/app/Dashboard/attribute/attribute-option';
import { IUnit } from 'src/app/Dashboard/unit/unit';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { AddQuestionModalComponent } from '../add-question-modal/add-question-modal.component';
import Swal from "sweetalert2";

@Component({
    templateUrl: './quick-add-attribute-modal.component.html',
    styleUrls: ['./quick-add-attribute-modal.component.scss']
})
export class QuickAddAttributeModalComponent implements OnInit {

    units: IUnit[] = [];
    selectedUnitId: number = null;

    attributeOptions: IAttributeOption[] = [];

    catId = 0;

    attrType = 1;
    attrTypeString = "";
    attrTitle = "";

    isRequired = true;

    attrMaxFileSize: number = null;



    isLoading = false;

    constructor(
        public dialogRef: MatDialogRef<AddQuestionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
    ) {
        this.attrType = this.data.attrType;
        this.catId = this.data.catId;

        this.attrTypeString = this.getAttributeTypeString(this.attrType);

        this.refreshUnits();
    }


    getAttributeTypeString(attrType: number) {
        return getAttributeTypeString(attrType);
    }


    ngOnInit() {
    }


    refreshUnits() {
        this.auth.post("/api/Unit/GetAll").subscribe(data => {
            if (data.success) {
                console.log(data.data);
                
                this.units = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        });
    }

    sts() {
        this.isLoading = true;
        this.auth.post("/api/Attribute/QuickAddAttribute", {
            catId: this.catId,
            unitId: this.selectedUnitId,
            attrType: this.attrType,
            attrTitle: this.attrTitle,
            isRequired: this.isRequired,
            attributeOptions: this.attributeOptions,
            attrMaxFileSize: this.attrMaxFileSize,
        }).pipe(finalize(() => this.isLoading = false)).subscribe(data => {
            if (data.success) {
                this.dialogRef.close(true);
                this.auth.message.showSuccessAlert();
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }


    async addAttributeOption() {
        let { value } = await Swal.fire({
            title: 'عنوان گزینه را وارد نمایید',
            input: 'text',
            inputValue: '',
            showCancelButton: true,
            cancelButtonText: "لغو",
            confirmButtonText: "ثبت",
            inputValidator: (value) => {
                if (!value) {
                    return 'وارد کردن عنوان گزینه الزامی است'
                }
            }
        });

        if (value) {
            let title: any = value;

            let attrOption: IAttributeOption = {
                attributeId: 0,
                id: 0,
                isTrue: false,
                title: title
            };

            this.attributeOptions.push(attrOption);
        }
    }

    async removeAttributeOption(option: IAttributeOption) {
        let attrOption = this.attributeOptions.find(c => c == option);

        if (attrOption) {

            let { value } = await Swal.fire({
                title: 'آیا از حذف این مورد اطمینان دارید؟',
                icon: "question",
                showCancelButton: true,
                cancelButtonText: "خیر",
                confirmButtonText: "بله",
            });

            if (value) {
                this.attributeOptions.splice(this.attributeOptions.indexOf(attrOption), 1);
            }
        }
    }

    async editAttributeOption(option: IAttributeOption) {
        let attrOption = this.attributeOptions.find(c => c == option);

        let { value } = await Swal.fire({
            title: 'عنوان گزینه را وارد نمایید',
            input: 'text',
            inputValue: option.title,
            showCancelButton: true,
            cancelButtonText: "لغو",
            confirmButtonText: "ثبت",
            inputValidator: (value) => {
                if (!value) {
                    return 'وارد کردن عنوان گزینه الزامی است'
                }
            }
        });

        if (value) {
            attrOption.title = value as any;
        }
    }

    async setIsTrueAttributeOption(option: IAttributeOption) {
        let isTrue = !option.isTrue;
        let attrOption = this.attributeOptions.find(c => c == option);

        this.attributeOptions.forEach(c => c.isTrue = false);
        attrOption.isTrue = isTrue;
    }


    isAttributeOptionRequired() {
        if ((this.attrType == 6 || this.attrType == 10) && this.attributeOptions.length == 0) {
            return true;
        }

        return false;
    }

}
