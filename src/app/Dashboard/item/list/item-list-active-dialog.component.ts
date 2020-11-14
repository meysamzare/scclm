import { Component, Inject, OnDestroy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { IItemAttr } from "../item-attr";
import { Subject } from "rxjs/internal/Subject";
import { debounceTime } from "rxjs/operators";

@Component({
    templateUrl: "./item-list-active-dialog.component.html"
})
export class ItemListActiveDialogComponent implements OnDestroy {
    // managment Attrs
    attrs: any[] = [];

    itemId: number = null;
    catId: number = null;

    itemAttrs: IItemAttr[] = [];

    isAttrLoad = true;

    catType = 0;
    catTypeTitle = "";

    setItemAttr$ = new Subject<{ val, attrId }>();

    constructor(
        public dialogRef: MatDialogRef<ItemListActiveDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
        private message: MessageService
    ) {
        this.itemId = data.id;
        this.catId = data.catId;
        this.catType = data.catType;
        this.catTypeTitle = this.catType == 0 ? 'نمون برگ' : 'آزمون آنلاین';

        this.auth.post("/api/Attribute/getNonClientAttrsForCat", this.catId).subscribe(data => {
            if (data.success) {
                this.attrs = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }

            this.isAttrLoad = false;
        }, er => {
            this.auth.handlerError(er);
            this.isAttrLoad = false;
        });

        this.auth.post("/api/Item/getItemAttrForItem", this.itemId).subscribe(data => {
            if (data.success) {
                this.itemAttrs = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

        this.setItemAttr$.pipe(
            debounceTime(600)
        ).subscribe(result => {
            this.setItemAttr(result.val, result.attrId);
        });
    }

    ngOnDestroy(): void {
        if (this.setItemAttr$) {
            this.setItemAttr$.unsubscribe();
        }
    }

    openc(picker1) {
        picker1.open();
    }


    getAttrPlaceholder(placeholder: string, title: string): string {
        if (placeholder) {
            return placeholder;
        }

        return title;
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
                        table: "Item",
                        tableObjectIds: [itemId]
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
