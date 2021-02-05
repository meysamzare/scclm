import { Component, ViewChild, AfterContentInit, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { ENTER } from "@angular/cdk/keycodes";
import { ITags } from "../tags";
import { MatChipInputEvent, MatDialog } from "@angular/material";
import { IUnit } from "../../unit/unit";
import { IAttr } from "../../attribute/attribute";
import { IItemAttr } from "../item-attr";
import { ICategory } from "../../category/category";
import { IAttributeOption } from "../../attribute/attribute-option";
import { HttpRequest, HttpHeaders, HttpEventType } from "@angular/common/http";
import { map, catchError, last } from "rxjs/operators";
import { of, EMPTY } from "rxjs";
import { Location } from "@angular/common";

declare let $: any;

@Component({
    templateUrl: "./item-edit.component.html",
    styles: [
        `
            .example-full-width {
                width: 100%;
            }
            div.di {
                pointer-events: none;
                opacity: 0.6;
            }
            .pad-r {
                margin-right: 3px;
            }
            
            .radio-group {
                display: flex;
                flex-direction: column;
            }

            .radio-button {
                margin: 0;
            }

            .attrSection img {
                width: 100%;
            }
        `
    ]
})
export class ItemEditComponent implements AfterContentInit, OnInit, OnDestroy {
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    item;

    oldData = null;

    data;

    tags: ITags[] = [];

    tys: IUnit[] = [];

    attrs: IAttr[] = [];

    itemAttrs: IItemAttr[] = [];

    loadAttrs: boolean = false;

    loadItemAttr = false;

    Categories: ICategory[] = [];

    selectedCategoryId = null;

    readonly separatorKeysCodes: number[] = [ENTER];

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    TYPE = 0;

    pageTitle = "نمون برگ";
    pageTitles = "نمون برگ ها";
    pageUrl = "category";

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService,
        public dialog: MatDialog,
        public location: Location
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                // this.tys = data.unit;
                this.data = data.item;
                this.item = this.data.item;

                this.oldData = JSON.stringify(this.item);

                this.TYPE = data["Type"];

                if (this.TYPE == 1) {
                    this.pageTitle = "آزمون آنلاین";
                    this.pageTitles = "آزمون های آنلاین";
                    this.pageUrl = "online-exam";
                }
            });

            let id = params["id"];

            if (id === "0") {
                this.Title = "افزودن نمون برگ";
                this.btnTitle = "افزودن";
                this.isEdit = false;
                this.attrs = [];
                this.tags = [];
                this.itemAttrs = [];
            } else {
                let idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش نمون برگ " + this.item.title;
                    this.btnTitle = "ویرایش";
                    this.isEdit = true;

                    this.item.tags.split(",").forEach(st => {
                        this.tags.push({ name: st });
                    });

                    if (
                        !this.auth.checkForMatchRole(
                            this.item.categoryRoleAccess
                        )
                    ) {
                        this.route.navigate(["/dashboard/item"], { queryParamsHandling: "preserve" });
                    }

                    $("#divtree").jstree("deselect_all");
                    $("#divtree").jstree("refresh");
                    $("#divtree").jstree("open_all");
                    $("#divtree").on("load_node.jstree", (e, n) => {
                        if (n.node.id == this.item.category.id) {
                            $("#divtree").jstree(
                                "select_node",
                                "#" + this.item.category.id,
                                true
                            );
                        }
                    });

                    // this.itemAttrs = this.item.itemAttribute;
                    this.loadItemAttr = true;
                    this.auth
                        .post("/api/Item/getItemAttrForItem", id)
                        .subscribe(
                            (data: jsondata) => {
                                if (data.success) {
                                    this.itemAttrs = data.data;
                                    this.loadItemAttr = false;
                                } else {
                                    this.message.showMessageforFalseResult(
                                        data
                                    );
                                    this.loadItemAttr = false;
                                }
                                this.loadItemAttr = false;
                            },
                            er => {
                                this.auth.handlerError(er);
                                this.loadItemAttr = false;
                            }
                        );

                    this.getItemAttr(this.item.categoryId);

                    // this.getItemAttr(this.item.categoryId);
                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }


            this.auth.post("/api/Category/getAllByType", this.TYPE).subscribe((data: jsondata) => {
                if (data.success) {
                    this.Categories = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            });


        });

        this.auth.post("/api/Unit/GetAll", null).subscribe((data: jsondata) => {
            if (data.success) {
                this.tys = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        });
    }

    ngOnDestroy(): void {

    }


    ngOnInit(): void { }

    getShiftedItem(attr: IAttr) {
        let options: IAttributeOption[] = (attr as any).attributeOptions || [];

        return options;
    }

    showDialogforLongSelect() {
    }

    openc(picker1) {
        picker1.open();
    }

    setItemAttrforselect(event, attrId) {
        let itemId = this.item.id;
        this.auth
            .post("/api/Item/setItemAttr", {
                attrId: attrId,
                itemId: itemId,
                inputValue: event
            }, {
                type: 'Add',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'setItemAttrForSelect(onItemEdit)',
                logSource: 'dashboard',
                object: {
                    attrId: attrId,
                    itemId: itemId,
                    inputValue: event
                },
                table: "Item",
                tableObjectIds: [itemId]
            })
            .subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.message.showSuccessAlert("با موفقیت ثبت شد");
                    } else {
                        this.message.showMessageforFalseResult(data);
                    }
                },
                er => {
                    this.auth.handlerError(er);
                }
            );
    }

    setItemAttrforPic(event, attrId, type) {
        let itemId = this.item.id;

        const fileIsInvalid = (message) => {
            event.target.value = null;
            event.target.files = null;
            return this.message.showWarningAlert(message);
        }

        let attribute = this.attrs.find(c => c.id == attrId);;

        let size = type == "file" ? attribute.maxFileSize : 10;
        let sizeText = type == "file" ? `${attribute.maxFileSize} مگابایت` : `10 مگابایت`;

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

            let result = "(binery)";

            let obj = {
                attributeId: attrId,
                attrubuteValue: result,
                itemId: itemId,
                fileName: file.name
            }

            let formData = new FormData();

            formData.append("object", JSON.stringify(obj));
            formData.append("files", file, file.name);

            let url = this.auth.serializeUrl(`/api/Item/setItemAttrForFiles`);

            let token = this.auth.getToken();

            let request = new HttpRequest('POST', url, formData, {
                reportProgress: false,
                headers: new HttpHeaders({
                    Authorization: `Bearer ${token}`,
                    "ngsw-bypass": "true"
                }),
            });

            this.auth.http.request(request).pipe(
                map(event => {
                    switch (event.type) {
                        case HttpEventType.Response:

                            let data: any = event.body;

                            if (data.success) {
                                let itemAttr = this.itemAttrs.find(c => c.attributeId == attrId);
                                if (itemAttr) {
                                    itemAttr.attributeFilePath = data.data;
                                }

                                this.auth.logToServer({
                                    type: 'Add',
                                    agentId: this.auth.getUserId(),
                                    agentType: 'User',
                                    agentName: this.auth.getUser().fullName,
                                    tableName: 'setItemAttrForFiles(saveFile(OnItemEdit))',
                                    logSource: 'dashboard',
                                    object: obj,
                                    table: "Item",
                                    tableObjectIds: [itemId]
                                }, data);

                                this.message.showSuccessAlert("با موفقیت ثبت شد");
                            } else {
                                this.message.showWarningAlert("خطایی روی داده است لطفا با راهبر سیستم تماس حاصل فرمایید");
                                this.message.showMessageforFalseResult(data);
                            }
                            break;
                    }
                }),
                catchError(() => {
                    this.message.showWarningAlert("خطایی روی داده است لطفا با راهبر سیستم تماس حاصل فرمایید");
                    return of(EMPTY);
                }),
                last()
            ).subscribe();
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

    setAttrForNullPic(attrId) {
        let itemId = this.item.id;

        this.auth.post("/api/Item/removeItemAttrFile", {
            attrId: attrId,
            itemId: itemId
        }, {
            type: 'Delete',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'ItemAttrForNullFile(DeleteFileIfExist(OnItemEdit))',
            logSource: 'dashboard',
            object: {
                attrId: attrId,
                itemId: itemId
            },
            table: "Item",
            tableObjectIds: [itemId]
        }).subscribe(data => {
            if (data.success) {
                let itemAttr = this.itemAttrs.find(c => c.attributeId == attrId);
                itemAttr.attributeFilePath = "";

                this.message.showSuccessAlert("با موفقیت ثبت شد");
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    setItemAttr(event, attrId) {
        if (this.isEdit) {
            let itemId = this.item.id;
            let inputValue;
            if (event.target) {
                inputValue = event.target.value;
            } else {
                // checkBox
                inputValue = event.checked;
            }

            this.auth
                .post("/api/Item/setItemAttr", {
                    attrId: attrId,
                    itemId: itemId,
                    inputValue: inputValue
                }, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'setItemAttrForInputs(onItemEdit)',
                    logSource: 'dashboard',
                    object: {
                        attrId: attrId,
                        itemId: itemId,
                        inputValue: inputValue
                    },
                    table: "Item",
                    tableObjectIds: [itemId]
                })
                .subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");
                            let allInputs = $("input[tabindex]").toArray();

                            let nextInput =
                                allInputs[allInputs.findIndex(c => c.tabIndex == event.target.tabIndex) + 1];

                            if (nextInput) {
                                nextInput.focus();
                            }
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

    setIsActive(isActive) {
        this.item.isActive = isActive;
    }

    getItemAttrVal(attrId): string {
        let a = this.itemAttrs.find(c => c.attributeId == attrId);

        if (a) {
            return a.attrubuteValue;
        }

        return "";
    }

    getItemAttrUrl(attrId): string {
        let a = this.itemAttrs.find(c => c.attributeId == attrId);

        if (a) {
            return this.auth.apiUrl + a.attributeFilePath.substr(1);
        }

        return "";
    }

    getItemAttr(catId: number) {
        this.loadAttrs = true;
        this.auth.post("/api/Attribute/getAttrsForCat", catId).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.attrs = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
        this.loadAttrs = false;
    }

    getAttrsForUnit(unitId): any[] {
        return this.attrs.filter(c => c.unitId == unitId);
    }

    ngAfterContentInit(): void {

    }

    onCategorySelect() {
        if (this.item.categoryId && !this.isEdit) {
            this.auth.post("/api/Category/getCategory", this.item.categoryId).subscribe((data: jsondata) => {
                if (data.success) {
                    this.item.categoryRoleAccess = data.data.roleAccess;
                    if (
                        this.auth.checkForMatchRole(
                            this.item.categoryRoleAccess
                        )
                    ) {
                        this.getItemAttr(this.item.categoryId);
                    } else {
                        this.item.categoryId = null;
                    }
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            });
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

    isCatSelected(): boolean {
        return this.item.categoryId == 0 ? false : true;
    }

    isUnitSelected(): boolean {
        return this.item.unitId == 0 ? false : true;
    }

    goToList() {
        this.route.navigate(["/dashboard/item"]);
    }

    sts() {
        if (this.fm1.valid) {

            this.item.tags = "";
            this.tags.forEach((tag, index) => {
                if (index == 0) {
                    this.item.tags += tag.name;
                } else {
                    this.item.tags += "," + tag.name;
                }
            });

            if (this.isEdit) {
                this.auth.post("/api/Item/Edit", this.item, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Edit Item',
                    logSource: 'dashboard',
                    object: this.item,
                    oldObject: JSON.parse(this.oldData),
                    table: "Item",
                    tableObjectIds: [this.item.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            if (this.item.id == this.auth.getUserRole().id) {
                                this.auth.refreshUserData();
                            }

                            this.route.navigate(["/dashboard/item"], { queryParamsHandling: "preserve" });
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/Item/Add", this.item, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Add Item',
                    logSource: 'dashboard',
                    object: this.item,
                    table: "Item",
                    tableObjectIds: [this.item.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate([
                                "/dashboard/item/edit/" + data.data
                            ], { queryParamsHandling: "preserve" });
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

    showPopupImage() {
    }
}
