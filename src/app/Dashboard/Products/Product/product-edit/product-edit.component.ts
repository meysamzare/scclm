import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IProduct, getProductTypeString, ProductType } from '../product';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { IWriter } from '../../Writer/writer';
import { IProductCategory } from '../../ProductCategory/product-category';
import { ITags } from 'src/app/Dashboard/item/tags';
import { ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
    selector: 'app-product-edit',
    templateUrl: './product-edit.component.html',
    styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit, OnDestroy {
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    PAGE_Data: IProduct;

    oldData = null;

    PAGE_TITLE = " محصول ";
    PAGE_TITLES = " محصولات ";

    PAGE_APIURL = "Product";
    PAGE_URL = "product";

    valueTitle = "تعداد صفحات";
    writerTitle = "نویسنده";


    TYPE = 0;


    public Editor = ClassicEditor;
    public config = {
        language: {
            ui: 'fa',
            content: 'en'
        }
    };

    // ckEditorConfig = {
    //     language: 'fa',
    //     autoParagraph: false
    // };

    writers: IWriter[] = [];
    productCategories: IProductCategory[] = [];

    @ViewChild("fm1", { static: false }) public fm1: NgForm;
    @ViewChild("d1", { static: false }) public d1;

    tags: ITags[] = [];
    readonly separatorKeysCodes: number[] = [ENTER];

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        public auth: AuthService
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.PAGE_Data = data.product;

                this.oldData = JSON.stringify(data.product);

                if (!this.PAGE_Data.picData) {
                    this.PAGE_Data.picData = "";
                }

                this.TYPE = data["type"];

                this.PAGE_Data.totalType = this.TYPE;

                if (this.TYPE == 1) {
                    this.PAGE_TITLE = " آموزش مجازی آفلاین ";
                    this.PAGE_TITLES = "آموزش های مجازی آفلاین ";

                    this.valueTitle = "زمان به دقیقه";
                    this.writerTitle = "مدرس";

                    this.PAGE_Data.totalPrice = 0;

                    this.PAGE_URL = "virtual-teaching/offline";
                }

            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "افزودن " + this.PAGE_TITLE;
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش " + this.PAGE_TITLE + this.PAGE_Data.title;
                    this.btnTitle = "ویرایش";
                    this.isEdit = true;


                    if (this.PAGE_Data.tags.length != 0) {
                        this.PAGE_Data.tags.split(",").forEach(st => {
                            this.tags.push({ name: st });
                        });
                    }
                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }

            this.auth.post("/api/Writer/getAll").subscribe(data => {
                if (data.success) {
                    this.writers = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

            this.auth.post("/api/ProductCategory/getAll").subscribe(data => {
                if (data.success) {
                    this.productCategories = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        });
    }

    
    ngOnDestroy(): void {
        let title = this.PAGE_APIURL;
        if (!this.fm1.submitted) {
            if (this.fm1.dirty) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.PAGE_Data)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }


    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || "").trim()) {
            this.tags.push({ name: value.trim() });
        }

        if (input) {
            input.value = "";
        }
    }

    remove(tag: ITags): void {
        const index = this.tags.indexOf(tag);

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }

    getProductTypeString(type) {
        return getProductTypeString(type);
    }

    onProductTypeChange() {
        var type = this.PAGE_Data.type;

        if (type != null) {
            if (type == 0 || type == 1) {
                this.valueTitle = "تعداد صفحات";
                this.writerTitle = "نویسنده";
            }
            if (type == 2 || type == 3) {
                this.valueTitle = "زمان به دقیقه";
                this.writerTitle = "مدرس";
            }
        }
    }

    getSlicedPrice() {
        var price = this.PAGE_Data.totalPrice;
        if (price) {
            return (price as Number).toLocaleString();
        }
    }


    setPic(files: File[]) {

        files.forEach(file => {
            if (file.size / 1024 / 1024 > 2) {
                this.d1.reset();
                return this.message.showWarningAlert(
                    "حجم فایل باید کمتر از " + " دو مگابایت " + " باشد",
                    "اخطار"
                );
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e: ProgressEvent) => {
                let result = reader.result.toString().split(",")[1];

                this.PAGE_Data.picData = result;
                this.PAGE_Data.picName = file.name;
            };
        });
    }

    removePic() {
        this.d1.reset();
        this.PAGE_Data.picData = "";
        this.PAGE_Data.picName = "";
    }

    sts() {
        if (this.fm1.valid) {


            this.PAGE_Data.tags = "";

            if (this.tags.length != 0) {

                this.tags.forEach((tag, index) => {
                    if (index == 0) {
                        this.PAGE_Data.tags += tag.name;
                    } else {
                        this.PAGE_Data.tags += "," + tag.name;
                    }
                });
            }

            if (this.isEdit) {
                this.auth.post("/api/" + this.PAGE_APIURL + "/Edit", this.PAGE_Data, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: this.PAGE_APIURL,
                    logSource: 'dashboard',
                    object: this.PAGE_Data,
                    oldObject: JSON.parse(this.oldData)
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/" + this.PAGE_URL]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/" + this.PAGE_APIURL + "/Add", this.PAGE_Data, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: this.PAGE_APIURL,
                    logSource: 'dashboard',
                    object: this.PAGE_Data,
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/" + this.PAGE_URL]);
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

    ngOnInit() {
    }

}
