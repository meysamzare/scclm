import { Component, ViewChild, AfterViewInit, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { IAttr } from '../attribute';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { IUnit } from '../../unit/unit';
import { ITags } from '../../item/tags';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Location } from '@angular/common';
import { ICategory } from '../../category/category';
import { IAttributeOption } from '../attribute-option';
import Swal from "sweetalert2";
import { finalize } from 'rxjs/internal/operators/finalize';
import { IQuestion } from '../../Question/question/question';

declare var $: any;

@Component({
    templateUrl: './attribute-edit.component.html',
    styles: [
        `
            div.di {
                pointer-events: none;
                opacity: 0.6;
            }
        `
    ]
})
export class AttributeEditComponent implements AfterViewInit, OnInit, AfterViewChecked, OnDestroy {

    Title: string;
    btnTitle: string;
    isEdit = false;

    attr: IAttr;

    oldData = null;

    catTree: string;

    tys: IUnit[] = [];

    values: ITags[] = [];

    attributes: IAttr[] = [];

    selectedCloneAttr: number = null;

    readonly separatorKeysCodes: number[] = [ENTER];

    parsedHtml;

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    Categories: ICategory[] = [];

    attributeOptions: IAttributeOption[] = [];

    TYPE = 0;

    pageTitle = "نمون برگ";
    pageTitles = "نمون برگ ها";
    pageUrl = "category";

    Questions: IQuestion[] = [];

    constructor(
        public route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService,
        public location: Location
    ) {
        this.activeRoute.params.subscribe(params => {

            this.activeRoute.data.subscribe(data => {
                
                this.TYPE = data["Type"];

                if (this.TYPE == 1) {
                    this.pageTitle = "آزمون آنلاین";
                    this.pageTitles = "آزمون های آنلاین";
                    this.pageUrl = "online-exam";
                }

                this.auth.post("/api/Category/getAllByType", this.TYPE).subscribe((data: jsondata) => {
                    if (data.success) {
                        this.Categories = data.data;
                    } else {
                        this.message.showMessageforFalseResult(data);
                    }
                });

                
                this.auth.post("/api/Question/getAll").subscribe((data: jsondata) => {
                    if (data.success) {
                        this.Questions = data.data;
                    } else {
                        this.message.showMessageforFalseResult(data);
                    }
                });
            });

            const id = params['id'];

            if (id === '0') {
                this.attr = new IAttr();

                this.attr.isTemplate = this.TYPE == 2 ? true : false;

                this.Title = 'افزودن فیلد';
                this.btnTitle = 'افزودن';
                this.isEdit = false;
            } else {
                const idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.auth.post('/api/Attribute/getAttribute', id).subscribe(
                        (data: jsondata) => {
                            if (data.success) {
                                this.attr = data.data;

                                this.oldData = JSON.stringify(data.data);

                                this.Title = 'ویرایش فیلد ' + this.attr.title;
                                this.btnTitle = 'ویرایش';
                                this.isEdit = true;

                                this.attr.isTemplate = this.TYPE == 2 ? true : false;

                                this.refreshAttributeOptions();
                            } else {
                                this.message.showMessageforFalseResult(data);
                            }
                        },
                        er => {
                            this.auth.handlerError(er);
                        }
                    );
                } else {
                    this.message.showWarningAlert('invalid Data');
                    this.route.navigate(['/dashboard']);
                }
            }
        });
    }

    ngOnDestroy(): void {
        let title = "attribute";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty && !this.isEdit) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.attr)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }


    async ngOnInit(): Promise<void> {
        this.auth.post('/api/Unit/GetAll', null).subscribe((data: jsondata) => {
            if (data.success) {
                this.tys = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        });
        this.auth.post('/api/Attribute/getAllByCatType', this.TYPE).subscribe((data: jsondata) => {
            if (data.success) {
                this.attributes = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        });

        // let title = "attribute";
        // if (await this.auth.draft.isAnyDraft(title)) {
        //     this.attr = JSON.parse((await this.auth.draft.getDraft(title)).value);
        // }
    }

    cloneAttrChange() {
        let selectedAttrId = this.selectedCloneAttr;
        if (selectedAttrId) {
            this.auth.post('/api/Attribute/getAttribute', selectedAttrId).subscribe(data => {
                if (data.success) {
                    data.data.categoryId = this.attr.categoryId;
                    this.attr = data.data;

                    if (this.attr.attrTypeInt == 6 || this.attr.attrTypeInt == 10) {
                        this.attr.values.split(',').forEach(st => {
                            this.values.push({ name: st });
                        });

                        this.values.splice(0, 1);
                    }
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }
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
                attributeId: this.attr.id,
                id: 0,
                isTrue: false,
                title: title
            };

            if (this.isEdit) {
                this.auth.post("/api/Attribute/AddAttributeOption", attrOption, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Add Attribute Option',
                    logSource: 'dashboard',
                    object: attrOption,
                    table: "AttributeOption",
                    tableObjectIds: [attrOption.id, attrOption.attributeId]
                }).subscribe(data => {
                    if (data.success) {
                        this.auth.message.showSuccessAlert();
                        this.refreshAttributeOptions();
                    } else {
                        this.auth.message.showMessageforFalseResult(data);
                    }
                }, er => {
                    this.auth.handlerError(er);
                });
            } else {
                this.attributeOptions.push(attrOption);
            }
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
                if (this.isEdit) {
                    this.auth.post("/api/Attribute/RemoveAttributeOption", attrOption, {
                        type: 'Delete',
                        agentId: this.auth.getUserId(),
                        agentType: 'User',
                        agentName: this.auth.getUser().fullName,
                        tableName: 'Remove Attribute Option',
                        logSource: 'dashboard',
                        deleteObjects: [attrOption],
                        table: "AttributeOption",
                        tableObjectIds: [attrOption.id, attrOption.attributeId]
                    }).subscribe(data => {
                        if (data.success) {
                            this.auth.message.showSuccessAlert("با موفقیت حذف شد");
                            this.attributeOptions.splice(this.attributeOptions.indexOf(attrOption), 1);
                        } else {
                            this.auth.message.showMessageforFalseResult(data);
                        }
                    }, er => {
                        this.auth.handlerError(er);
                    });
                } else {
                    this.attributeOptions.splice(this.attributeOptions.indexOf(attrOption), 1);
                }
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

            if (this.isEdit) {
                this.auth.post("/api/Attribute/EditAttributeOption", attrOption, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Edit Attribute Option',
                    logSource: 'dashboard',
                    object: attrOption,
                    oldObject: option,
                    table: "AttributeOption",
                    tableObjectIds: [attrOption.id, attrOption.attributeId]
                }).subscribe(data => {
                    if (data.success) {
                        this.auth.message.showSuccessAlert("با موفقیت حذف شد");
                        this.refreshAttributeOptions();
                    } else {
                        this.auth.message.showMessageforFalseResult(data);
                        attrOption.title = option.title;
                    }
                }, er => {
                    this.auth.handlerError(er);
                    attrOption.title = option.title;
                });
            }
        }
    }

    async setIsTrueAttributeOption(option: IAttributeOption) {
        let isTrue = !option.isTrue;
        let attrOption = this.attributeOptions.find(c => c == option);

        if (this.isEdit) {
            this.auth.post("/api/Attribute/setTrueOption", option, {
                type: 'Edit',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Set Attribute True Option',
                logSource: 'dashboard',
                object: option,
                oldObject: option,
                table: "AttributeOption",
                tableObjectIds: [attrOption.id, attrOption.attributeId]
            }).subscribe(data => {
                if (data.success) {
                    this.refreshAttributeOptions();
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        } else {
            this.attributeOptions.forEach(c => c.isTrue = false);
            attrOption.isTrue = isTrue;
        }
    }

    loadingAttrOptions = false;

    refreshAttributeOptions() {
        if (this.isEdit) {
            this.loadingAttrOptions = true;
            this.auth.post("/api/Attribute/getAttributeOptions", this.attr.id)
                .pipe(finalize(() => this.loadingAttrOptions = false))
                .subscribe(data => {
                    if (data.success) {
                        this.attributeOptions = data.data;
                    } else {
                        this.auth.message.showMessageforFalseResult(data);
                    }
                }, er => {
                    this.auth.handlerError(er);
                });
        }
    }

    isAttributeOptionRequired() {
        if ((this.attr.attrTypeInt == 6 || this.attr.attrTypeInt == 10) && this.attributeOptions.length == 0) {
            return true;
        }

        return false;
    }

    isCatSelected(): boolean {
        if (this.TYPE != 2) {
            return this.attr.categoryId == null ? false : true;
        }
        return true;
    }

    isUnitSelected(): boolean {
        return this.attr.unitId == 0 ? false : true;
    }

    isTypeSelected(): boolean {
        return this.attr.attrTypeInt == 0 ? false : true;
    }

    sts() {
        if (this.fm1.valid) {

            let options = [];

            if (this.attr.attrTypeInt == 6 || this.attr.attrTypeInt == 10) {
                options = this.attributeOptions;
            }

            this.attr.attrType = this.attr.attrTypeInt;

            if (this.isEdit) {
                this.auth.post('/api/Attribute/Edit', {
                    attr: this.attr,
                    options: options
                }, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Edit Attribute',
                    logSource: 'dashboard',
                    object: {
                        attr: this.attr,
                        options: options
                    },
                    oldObject: JSON.parse(this.oldData),
                    table: "Attribute",
                    tableObjectIds: [this.attr.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert('با موفقیت ثبت شد');

                            // this.route.navigate(['/dashboard/attribute']);
                            this.location.back();
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post('/api/Attribute/Add', {
                    attr: this.attr,
                    options: options
                }, {
                    type: "Add",
                    agentId: this.auth.getUserId(),
                    agentType: "User",
                    agentName: this.auth.getUser().fullName,
                    tableName: "Add Attribute",
                    logSource: "dashboard",
                    object: {
                        attr: this.attr,
                        options: options
                    },
                    table: "Attribute",
                    tableObjectIds: [this.attr.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert('با موفقیت ثبت شد');

                            // this.route.navigate(["/dashboard/attribute"]);
                            this.clearForm();
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            }
        } else {
            this.message.showWarningAlert('مقادیر خواسته شده را تکمیل نمایید');
        }
    }

    clearForm() {
        this.attr.title = '';
        this.attr.attrTypeInt = null;
        this.attr.desc = '';
        this.attr.unitId = null;
        this.attr.values = '';
        this.values = [];
        this.attr.isUniq = false;
        this.attr.orderInt = null;
        this.attr.placeholder = "";
        this.attr.isRequired = true;
        this.attr.isMeliCode = false;
        this.attributeOptions = [];
    }

    ngAfterViewChecked(): void {

    }

    ngAfterViewInit(): void {

    }
}
