import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { IAttr } from "../../attribute/attribute";
import { IItemAttr } from "../item-attr";

declare var $: any;

@Component({
    templateUrl: "./item-list-active-dialog.component.html"
})
export class ItemListActiveDialogComponent {
    // managment Attrs
    attrs: IAttr[] = [];

    itemId: number = null;
    catId: number = null;

    itemAttrs: IItemAttr[] = [];

    isAttrLoad = true;

    constructor(
        public dialogRef: MatDialogRef<ItemListActiveDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private router: Router,
        private activeroute: ActivatedRoute,
        private auth: AuthService,
        private message: MessageService
    ) {
        this.itemId = data.id;
        this.catId = data.catId;

        this.auth
            .post("/api/Attribute/getNonClientAttrsForCat", this.catId)
            .subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.attrs = data.data;
                    } else {
                        this.message.showMessageforFalseResult(data);
                    }

                    this.isAttrLoad = false;
                },
                er => {
                    this.auth.handlerError(er);
                    this.isAttrLoad = false;
                }
            );

        this.auth.post("/api/Item/getItemAttrForItem", this.itemId).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.itemAttrs = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
    }

    openc(picker1) {
        picker1.open();
    }

    getShiftedItem(items: string) {
        var a = items.substring(1);

        return a.split(",");
    }

    setItemAttrforselect(event, attrId) {
        var itemId = this.itemId;
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
                tableName: 'setItemAttrForSelect(onActiveDialog)',
                logSource: 'dashboard',
                object: {
                    attrId: attrId,
                    itemId: itemId,
                    inputValue: event
                },
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
        var itemId = this.itemId;
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
                        tableName: 'setItemAttrForFiles(saveFile(OnActiveDialog))',
                        logSource: 'dashboard',
                        object: {
                            attrId: attrId,
                            itemId: itemId,
                            inputValue: result,
                            fileFormat: file.type,
                            fileName: file.name
                        },
                    })
                    .subscribe(
                        (data: jsondata) => {
                            if (data.success) {
                                this.message.showSuccessAlert(
                                    "با موفقیت ثبت شد"
                                );
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
        var itemId = this.itemId;
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
                tableName: 'ItemAttrForNullFile(DeleteFileIfExist(OnActiveDialog))',
                logSource: 'dashboard',
                object: {
                    attrId: attrId,
                    itemId: itemId,
                    inputValue: ""
                },
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

    setItemAttr(event, attrId) {
        var itemId = this.itemId;
        let inputValue;
        if (event.target) {
            inputValue = event.target.value;
        } else {
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
                tableName: 'setItemAttrForInputs(OnActiveDialog)',
                logSource: 'dashboard',
                object: {
                    attrId: attrId,
                    itemId: itemId,
                    inputValue: inputValue
                },
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

        let allInputs = $("input[tabindex]").toArray();

        var nextInput = allInputs[allInputs.findIndex(c=> c.tabIndex == event.target.tabIndex) + 1];

        if (nextInput) {
            nextInput.focus();
        }
        
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
}
