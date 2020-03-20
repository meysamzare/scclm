import { Component, Inject } from "@angular/core";
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatChipInputEvent
} from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { IAttr } from "../../attribute/attribute";
import { ITags } from "../tags";
import { ENTER } from "@angular/cdk/keycodes";

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
        private router: Router,
        private activeroute: ActivatedRoute,
        private auth: AuthService,
        private message: MessageService
    ) {
        this.catId = data.catId;

        this.itemsIds = data.selectedItemsIds;

        this.auth.post("/api/Attribute/getAttrsForCat", this.catId).subscribe(
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

    getShiftedItem(items: string) {
        var a = items.substring(1);

        return a.split(",");
    }

    openc(picker1) {
        picker1.open();
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
                        }
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
                }
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
        let inputValue;
        if (event.target) {
            inputValue = event.target.value;
        } else {
            inputValue = event.checked;
        }

        this.auth
            .post("/api/Item/setItemAttrGroup", {
                attrId: attrId,
                itemsIds: this.itemsIds,
                inputValue: inputValue
            }, {
                type: 'Add',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'SetItemAttrGroup',
                logSource: 'dashboard',
                object: {
                    attrId: attrId,
                    itemsIds: this.itemsIds,
                    inputValue: inputValue
                }
            })
            .subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.message.showSuccessAlert("با موفقیت ثبت شد");
                        let allInputs = $("input[tabindex]").toArray();

                        var nextInput =
                            allInputs[
                            allInputs.findIndex(c => c.tabIndex == event.target.tabIndex) +
                            1
                            ];

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
