import { Component, ViewChild, OnInit, AfterViewInit, AfterViewChecked } from "@angular/core";
import { jsondata, AuthService } from "src/app/shared/Auth/auth.service";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { ICategory } from "../category";
import { DomSanitizer } from "@angular/platform-browser";
import { RoleClass } from "../../role/role";
import { getPostTypeString } from "../../WebSiteManagment/post/post";
import { IAttr } from "../../attribute/attribute";
import { IUnit } from "../../unit/unit";
import Swal from "sweetalert2";
import { IAttributeOption } from "../../attribute/attribute-option";

declare var $: any;
// import * as $ from 'jquery';

@Component({
    templateUrl: "./category-edit.component.html",
    styles: [
        `
            .example-radio-group {
                display: flex;
                flex-direction: column;
                margin: 15px 0;
            }

            .example-radio-button {
                margin: 5px;
            }

        `
    ]
})
export class CategoryEditComponent implements OnInit, AfterViewInit, AfterViewChecked {
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    category: ICategory;

    oldData = null;

    catTree: string;

    parsedHtml;

    roles: RoleClass[] = [];


    units: IUnit[] = [];

    attributes: IAttr[] = [];
    isLoading = false;


    @ViewChild("fm1", { static: false }) public fm1: NgForm;
    @ViewChild("d1", { static: false }) public d1;
    @ViewChild("d2", { static: false }) public d2;
    @ViewChild("d3", { static: false }) public d3;

    Categories: ICategory[] = [];
    

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        public auth: AuthService,
        private sanitizer: DomSanitizer
    ) {
        this.auth.post("/api/Category/GetAll").subscribe((data: jsondata) => {
            if (data.success) {
                this.Categories = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        });
        
        this.activeRoute.params.subscribe(params => {

            this.activeRoute.data.subscribe(data => {
                this.category = data.cat;

                this.oldData = JSON.stringify(data.cat);

                if (!this.category.registerFileData) {
                    this.category.registerFileData = "";
                }

                if (!this.category.showInfoFileData) {
                    this.category.showInfoFileData = "";
                }

                if (!this.category.headerPicData) {
                    this.category.headerPicData = "";
                }
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "افزودن نمون برگ";
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title =
                        "ویرایش نمون برگ " + this.category.title;
                    this.btnTitle = "ویرایش";
                    this.isEdit = true;
                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }

            this.auth.post("/api/Role/GetAll", null).subscribe((data: jsondata) => {
                if (data.success) {
                    this.roles = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            })
        });
    }

    openc(picker1) {
        picker1.open();
    }


    getShiftedItem(attr: IAttr) {
        let options: IAttributeOption[] = (attr as any).attributeOptions || [];

        return options;
    }

    getAttrsForUnit(unitId): IAttr[] {
        return this.attributes.filter(c => c.unitId == unitId);
    }

    async deleteAttr(id) {
        if (this.auth.isUserAccess("remove_Attribute")) {

            let swalResult = await Swal.fire({
                title: "آیا اطمینان دارید؟",
                text: "حذف کردن این موارد قابل بازگشت نمی باشد",
                icon: "question",
                showCancelButton: true,
                cancelButtonText: "خیر",
                confirmButtonText: "بله"
            });

            if (swalResult.value) {
                let ids: number[] = [id];

                let attr = this.attributes.find(c => c.id == id);

                let deleteDatas = [attr];

                this.auth.post("/api/Attribute/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Attribute From Category Edit',
                    logSource: 'dashboard',
                    deleteObjects: deleteDatas,
                    table: "Attribute",
                    tableObjectIds: ids
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert(
                                "مورد انتخابی با موفقیت حذف شد"
                            );

                            this.attributes.splice(this.attributes.indexOf(attr), 1);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            }

        }
    }

    editAttr(id) {
        if (this.auth.isUserAccess("edit_Attribute")) {
            this.route.navigateByUrl(`/dashboard/attribute/edit/${id}`);
        }
    }


    ngOnDestroy(): void {
        let title = "category";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty && !this.isEdit) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.category)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

    ngOnInit(): void {
        if (this.isEdit) {
            this.auth.post("/api/Unit/GetAll").subscribe(data => {
                if (data.success) {
                    this.units = data.data;


                    this.auth.post("/api/Attribute/getAttrsForCat", this.activeRoute.snapshot.params["id"]).subscribe(
                        (data: jsondata) => {
                            if (data.success) {
                                this.attributes = data.data;
                            } else {
                                this.message.showMessageforFalseResult(data);
                            }
                        },
                        er => {
                            this.auth.handlerError(er);
                        }
                    );

                } else {
                    this.message.showMessageforFalseResult(data);
                }
            });
        }


    }

    ngAfterViewChecked(): void {

    }


    ngAfterViewInit(): void {

    }

    setPic(files: File[], type) {

        files.forEach(file => {
            if (file.size / 1024 / 1024 > 5) {
                if (type == 1) {
                    this.d1.reset();
                } else {
                    this.d2.reset();
                }
                return this.message.showWarningAlert(
                    "حجم فایل باید کمتر از " + " پنج مگابایت " + " باشد",
                    "اخطار"
                );
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e: ProgressEvent) => {
                let result = reader.result.toString().split(",")[1];

                // RegisterPic
                if (type == 1) {
                    this.category.registerFileData = result;
                    this.category.registerFileName = file.name;
                } else if (type == 2) {
                    this.category.showInfoFileData = result;
                    this.category.showInfoFileName = file.name;
                } else if (type == 3) {
                    this.category.headerPicData = result;
                    this.category.headerPicName = file.name;
                }
            };
        });
    }

    removePic(type) {
        // RegisterPic
        if (type == 1) {
            this.d1.reset();
            this.category.registerFileData = "";
            this.category.registerFileName = "";
        } else if (type == 2) {
            this.d2.reset();
            this.category.showInfoFileData = "";
            this.category.showInfoFileName = "";
        } else if (type == 3) {
            this.d3.reset();
            this.category.headerPicData = "";
            this.category.headerPicName = "";
        }
    }


    getPostTypeString(type) {
        return getPostTypeString(type);
    }

    getFileUrl(url): string {
        return this.auth.apiUrl + url.substr(1);
    }


    sts() {
        if (this.fm1.valid) {
            if (this.isEdit) {
                this.auth.post("/api/Category/Edit", this.category, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Edit Category',
                    logSource: 'dashboard',
                    object: this.category,
                    oldObject: JSON.parse(this.oldData),
                    table: "Category",
                    tableObjectIds: [this.category.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/category"]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/Category/Add", this.category, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Add Category',
                    logSource: 'dashboard',
                    object: this.category,
                    table: "Category",
                    tableObjectIds: [this.category.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/category"]);
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
            this.message.showWarningAlert("مقادیر خواسته شده را تکمیل نمایید");
        }
    }
}
