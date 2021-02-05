import { Component, Inject, OnDestroy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { IItemAttr } from "../item-attr";
import { Subject } from "rxjs/internal/Subject";
import { catchError, debounceTime, last, map } from "rxjs/operators";
import { IAttr } from "../../attribute/attribute";
import { IAttributeOption } from "../../attribute/attribute-option";
import { HttpEventType, HttpHeaders, HttpRequest } from "@angular/common/http";
import { of, EMPTY } from "rxjs";

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
        let itemId = this.itemId;

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
                                    tableName: 'setItemAttrForFiles(saveFile(On Active Item Dialog))',
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
                catchError((er) => {
                    console.log(er);
                    
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
        let itemId = this.itemId;

        this.auth.post("/api/Item/removeItemAttrFile", {
            attrId: attrId,
            itemId: itemId
        }, {
            type: 'Delete',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'ItemAttrForNullFile(DeleteFileIfExist(On Active Item Dialog))',
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

    getShiftedItem(attr: IAttr) {
        let options: IAttributeOption[] = (attr as any).attributeOptions || [];

        return options;
    }
}
