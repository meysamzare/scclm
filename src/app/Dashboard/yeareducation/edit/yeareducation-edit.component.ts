import { Component, ViewChild, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { IYeareducation } from "../yeareducation";
import { NgForm } from "@angular/forms";


@Component({
    templateUrl: "./yeareducation-edit.component.html"
})
export class YeareducationEditComponent implements OnDestroy {
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    yeareducation: IYeareducation;

    oldData = null;

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.yeareducation = data.yeareducation;

                this.oldData = JSON.stringify(data.yeareducation);
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "تعریف سال تحصیلی";
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش سال تحصیلی " + this.yeareducation.name;
                    this.btnTitle = "ویرایش";
                    this.isEdit = true;
                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }
        });
    }

    ngOnDestroy(): void {
        let title = "yeareducation";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty && !this.isEdit) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.yeareducation)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

    openc(picker) {
        picker.open();
    }

    sts() {
        if (this.fm1.valid) {
            if (this.isEdit) {
                this.auth.post("/api/Yeareducation/Edit", this.yeareducation, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Yeareducation',
                    logSource: 'dashboard',
                    object: this.yeareducation,
                    oldObject: JSON.parse(this.oldData),
                    table: "Yeareducation",
                    tableObjectIds: [this.yeareducation.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/yeareducation"]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/Yeareducation/Add", this.yeareducation, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Yeareducation',
                    logSource: 'dashboard',
                    object: this.yeareducation,
                    table: "Yeareducation",
                    tableObjectIds: [this.yeareducation.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/yeareducation"]);
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