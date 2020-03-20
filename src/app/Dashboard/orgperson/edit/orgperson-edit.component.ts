import { Component, ViewChild, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { IOrgPerson } from "../orgperson";
import { IInsurance } from "../../insurance/insurance";
import { IEducation } from "../../education/education";
import { IOrgChart } from "../../orgchart/orgchart";
import { ISalary } from "../../salary/salary";



@Component({
    templateUrl: "./orgperson-edit.component.html"
})
export class OrgPersonEditComponent implements OnDestroy {
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    orgperson: IOrgPerson;

    oldData = null;

    orgpersons: IOrgPerson[] = [];

    insurances: IInsurance[] = [];
    educations: IEducation[] = [];
    orgcharts: IOrgChart[] = [];
    salaries: ISalary[] = [];

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.orgperson = data.orgperson;

                this.oldData = JSON.stringify(data.orgperson);
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "افزودن پرسنل";
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش پرسنل " + this.orgperson.name;
                    this.btnTitle = "ویرایش";
                    this.isEdit = true;
                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }
        });

        this.auth.post("/api/OrgPerson/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.orgpersons = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );

        this.auth.post("/api/Insurance/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.insurances = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
        this.auth.post("/api/Education/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.educations = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
        this.auth.post("/api/OrgChart/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.orgcharts = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
        this.auth.post("/api/Salary/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.salaries = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
    }

    
    ngOnDestroy(): void {
        let title = "orgperson";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.orgperson)
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

    copySelectedData(id) {
        if (id != 0) {
            this.auth.post("/api/OrgPerson/getOrgPerson", id).subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.orgperson = data.data;
                        this.orgperson.id = 0;
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

    sts() {
        if (this.fm1.valid) {
            if (this.isEdit) {
                this.auth.post("/api/OrgPerson/Edit", this.orgperson, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'OrgPerson',
                    logSource: 'dashboard',
                    object: this.orgperson,
                    oldObject: JSON.parse(this.oldData)
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/orgperson"]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/OrgPerson/Add", this.orgperson, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'OrgPerson',
                    logSource: 'dashboard',
                    object: this.orgperson,
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/orgperson"]);
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