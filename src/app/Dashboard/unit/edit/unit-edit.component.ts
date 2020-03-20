import { Component, ViewChild } from "@angular/core";
import { IUnit } from "../unit";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    templateUrl: "./unit-edit.component.html"
})
export class UnitEditComponent {
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    unit: IUnit;

    oldData = null;

    catTree: string;

    parsedHtml;

    @ViewChild("fm1", {static: false}) public fm1: NgForm;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService,
        private sanitizer: DomSanitizer
    ) {
        this.activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.unit = data.unit;

                this.oldData = JSON.stringify(data.unit);
            });
            var id = params["id"];

            if (id === "0") {
                this.Title = "افزودن واحد";
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش واحد " + this.unit.title;
                    this.btnTitle = "ویرایش";
                    this.isEdit = true;
                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }
        });
    }

    sts() {
        if (this.fm1.valid) {
            if (this.isEdit) {
                this.auth.post("/api/Unit/Edit", this.unit, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Unit',
                    logSource: 'dashboard',
                    object: this.unit,
                    oldObject: JSON.parse(this.oldData)
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/unit"]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/Unit/Add", this.unit, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Unit',
                    logSource: 'dashboard',
                    object: this.unit,
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/unit"]);
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
