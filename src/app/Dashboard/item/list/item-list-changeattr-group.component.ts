import { Component, Inject } from "@angular/core";
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatChipInputEvent
} from "@angular/material";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { IAttr } from "../../attribute/attribute";
import { ITags } from "../tags";
import { ENTER } from "@angular/cdk/keycodes";
import { AttributeInputSaveItemAttributeEvent } from "projects/index/src/app/register-item/attribute-input/attribute-input/attribute-input.component";

declare var $: any;

@Component({
    templateUrl: "./item-list-changeattr-group.component.html"
})
export class ItemListChangeAttrGroupComponent {
    catId: number = null;

    attrs: IAttr[] = [];

    itemsIds: number[] = [];

    tags: ITags[] = [];

    tagsString: string = "";
    readonly separatorKeysCodes: number[] = [ENTER];

    constructor(
        public dialogRef: MatDialogRef<ItemListChangeAttrGroupComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
        private message: MessageService
    ) {
        this.catId = data.catId;

        this.itemsIds = data.selectedItemsIds;

        this.auth.post("/api/Attribute/getNonClientAttrsForCat", this.catId).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.attrs = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                    this.dialogRef.close();
                }
            },
            er => {
                this.auth.handlerError(er);
                this.dialogRef.close();
            }
        );
    }

    setTags() {
        this.tagsString = "";
        this.tags.forEach(row => {
            this.tagsString += "," + row.name;
        });

        this.auth
            .post("/api/Item/setTagsGroup", {
                itemsIds: this.itemsIds,
                tags: this.tagsString
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

    setAnyItemAttr(event: AttributeInputSaveItemAttributeEvent, attrType: number) {

        if (attrType == 7 || attrType == 8) {
            if (event.File) {
                this.setItemAttrforPic(event.File, event.attrId, attrType == 7 ? "pic" : "file");
            } else {
                this.setAttrForNullPic(event.attrId);
            }
            return;
        }


        this.setItemAttrforselect(event.attrValue, event.attrId);
    }

    setItemAttrforselect(event, attrId) {
        this.auth
            .post("/api/Item/setItemAttrGroup", {
                attrId: attrId,
                itemsIds: this.itemsIds,
                inputValue: event
            }, {
                type: 'Add',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'setItemAttrGroupForSelect',
                logSource: 'dashboard',
                object: {
                    attrId: attrId,
                    itemsIds: this.itemsIds,
                    inputValue: event
                },
                table: "Item",
                tableObjectIds: this.itemsIds
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

    setItemAttrforPic(file, attrId, type) {
        if (!file) {
            return;
        }
        let reader = new FileReader();
        var size = type == "file" ? 20 : 10;
        var sizeText = size == 10 ? "ده مگابایت" : "یک مگابایت";
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
                .post("/api/Item/setItemAttrForFilesGroup", {
                    attrId: attrId,
                    itemsIds: this.itemsIds,
                    inputValue: result,
                    fileFormat: file.type,
                    fileName: file.name
                }, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'setItemAttrForFilesGroup(saveFiles)',
                    logSource: 'dashboard',
                    object: {
                        attrId: attrId,
                        itemsIds: this.itemsIds,
                        inputValue: result,
                        fileFormat: file.type,
                        fileName: file.name
                    },
                    table: "Item",
                    tableObjectIds: this.itemsIds
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

    setAttrForNullPic(attrId) {
        this.auth
            .post("/api/Item/setItemAttrForFilesGroup", {
                attrId: attrId,
                itemsIds: this.itemsIds,
                inputValue: ""
            }, {
                type: 'Add',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'setItemAttrForNullFilesGroup(removeFiles)',
                logSource: 'dashboard',
                object: {
                    attrId: attrId,
                    itemsIds: this.itemsIds,
                    inputValue: ""
                },
                table: "Item",
                tableObjectIds: this.itemsIds
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
}
