import { Component, ViewChild, AfterContentInit, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { IItem } from "../item";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ITags } from "../tags";
import { MatChipInputEvent, MatDialog } from "@angular/material";
import { IUnit } from "../../unit/unit";
import { IAttr } from "../../attribute/attribute";
import { IItemAttr } from "../item-attr";
import { ItemEditLongTextSelectComponent } from "./item-edit-long-text-select.component";
import { ShowImageComponent } from "src/app/shared/Modal/show-image.component";

declare var $: any;

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

    readonly separatorKeysCodes: number[] = [ENTER];

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService,
        public dialog: MatDialog
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                // this.tys = data.unit;
                this.data = data.item;
                this.item = this.data.item;

                this.oldData = JSON.stringify(this.item);
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "افزودن نمون برگ";
                this.btnTitle = "افزودن";
                this.isEdit = false;
                this.attrs = [];
                this.tags = [];
                this.itemAttrs = [];
            } else {
                var idd = Number.parseInt(id);
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

                    if (this.data.attrs) {
                        this.attrs = this.data.attrs;
                    }

                    // this.getItemAttr(this.item.categoryId);
                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }


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

    getShiftedItem(items: string) {
        var a = items.substring(1);

        return a.split(",");
    }

    showDialogforLongSelect(longVal) {
        const dialogRef = this.dialog.open(ItemEditLongTextSelectComponent, {
            data: {
                text: longVal
            }
        });
    }

    openc(picker1) {
        picker1.open();
    }

    setItemAttrforselect(event, attrId) {
        var itemId = this.item.id;
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
        var itemId = this.item.id;
        let reader = new FileReader();
        var size = type == "file" ? 10 : 1;
        var sizeText = size == 10 ? "ده مگابایت" : "یک مگابایت";
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            if (file.size / 1024 / 1024 > size) {
                return this.message.showWarningAlert(
                    "حجم فایل باید کمتر از " + sizeText + " باشد",
                    "اخطار"
                );
            }
            reader.readAsDataURL(file);
            reader.onload = () => {
                let result = reader.result.toString().split(",")[1];
                // this.fileName = file.name + " " + file.type;
                this.auth
                    .post("/api/Item/setItemAttrForFiles", {
                        attrId: attrId,
                        itemId: itemId,
                        inputValue: result,
                        fileFormat: file.type,
                        fileName: file.name
                    }, {
                        type: 'Add',
                        agentId: this.auth.getUserId(),
                        agentType: 'User',
                        agentName: this.auth.getUser().fullName,
                        tableName: 'setItemAttrForFiles(saveFile(OnItemEdit))',
                        logSource: 'dashboard',
                        object: {
                            attrId: attrId,
                            itemId: itemId,
                            inputValue: result,
                            fileFormat: file.type,
                            fileName: file.name
                        },
                        table: "Item",
                        tableObjectIds: [itemId]
                    })
                    .subscribe(
                        (data: jsondata) => {
                            if (data.success) {
                                this.message.showSuccessAlert(
                                    "با موفقیت ثبت شد"
                                );

                                var a = this.itemAttrs.find(
                                    c => c.attributeId == attrId
                                );
                                a.attributeFilePath = data.data;
                            } else {
                                this.message.showMessageforFalseResult(data);
                            }
                        },
                        er => {
                            this.auth.handlerError(er);
                        }
                    );
            };
        }
    }

    setAttrForNullPic(attrId) {
        var itemId = this.item.id;
        this.auth
            .post("/api/Item/setItemAttrForFiles", {
                attrId: attrId,
                itemId: itemId,
                inputValue: ""
            }, {
                type: 'Add',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'ItemAttrForNullFile(DeleteFileIfExist(OnItemEdit))',
                logSource: 'dashboard',
                object: {
                    attrId: attrId,
                    itemId: itemId,
                    inputValue: ""
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

        var a = this.itemAttrs.find(c => c.attributeId == attrId);

        a.attributeFilePath = "";
    }

    setItemAttr(event, attrId) {
        if (this.isEdit) {
            var itemId = this.item.id;
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

                            var nextInput =
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
        var a = this.itemAttrs.find(c => c.attributeId == attrId);

        if (a) {
            return a.attrubuteValue;
        }

        return "";
    }

    getItemAttrUrl(attrId): string {
        var a = this.itemAttrs.find(c => c.attributeId == attrId);

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

    getAttrsForUnit(unitId): IAttr[] {
        return this.attrs.filter(c => c.unitId == unitId);
    }

    ngAfterContentInit(): void {
        var sanitizerUr = url => {
            return this.auth.serializeUrl(url);
        };

        $("#divtree").jstree({
            plugins: ["wholerow", "types"],
            core: {
                data: {
                    url: function (node) {
                        return node.id === "#"
                            ? sanitizerUr("/api/Category/GetTreeRoot")
                            : sanitizerUr(
                                "/api/Category/GetTreeChildren/" + node.id
                            );
                    },
                    data: function (node) {
                        return { id: node.id };
                    }
                },
                strings: {
                    "Loading ...": "لطفا اندکی صبر نمایید"
                },
                multiple: false
            },
            types: {
                default: {
                    icon: "fa fa-folder"
                }
            }
        });

        $("#divtree").on("changed.jstree", (e, data) => {
            console.log("selected");

            if (data.node) {
                if (!this.isEdit) {
                    this.item.categoryId = data.node.id;

                    this.auth.post("/api/Category/getCategory", data.node.id).subscribe((data: jsondata) => {
                        if (data.success) {
                            this.item.categoryRoleAccess = data.data.roleAccess;
                            if (
                                this.auth.checkForMatchRole(
                                    this.item.categoryRoleAccess
                                )
                            ) {
                                this.getItemAttr(this.item.categoryId);
                            } else {
                                $("#divtree").jstree("deselect_all");

                                this.item.categoryId = 0;
                            }
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    });



                }
            }
        });
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

    showPopupImage(imgUrl) {
        const dialog = this.dialog.open(ShowImageComponent, {
            data: {
                url: imgUrl
            }
        })
    }
}
