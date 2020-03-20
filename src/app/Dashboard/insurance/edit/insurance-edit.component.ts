import { Component, ViewChild, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { IInsurance } from "../insurance";


@Component({
    templateUrl: "./insurance-edit.component.html"
})
export class InsuranceEditComponent implements OnDestroy {
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    insurance: IInsurance;

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
                this.insurance = data.insurance;

                this.oldData = JSON.stringify(data.insurance);
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "افزودن بیمه";
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش بیمه " + this.insurance.name;
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
        let title = "insurance";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.insurance)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

    sts() {
        if (this.fm1.valid) {
            if (this.isEdit) {
                this.auth.post("/api/Insurance/Edit", this.insurance, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Insurance',
                    logSource: 'dashboard',
                    object: this.insurance,
                    oldObject: JSON.parse(this.oldData)
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/insurance"]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/Insurance/Add", this.insurance, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Insurance',
                    logSource: 'dashboard',
                    object: this.insurance,
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/insurance"]);
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