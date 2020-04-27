import { Component, ViewChild, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { IGrade } from "../grade";
import { ITitute } from "../../titute/titute";
import { IYeareducation } from "../../yeareducation/yeareducation";

@Component({
    templateUrl: "./grade-edit.component.html"
})
export class GradeEditComponent implements OnDestroy{
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    grade: IGrade;

    oldData = null;

    titutes: ITitute[] = [];
    yeareducations: IYeareducation[] = [];

    grades: IGrade[] = [];

    @ViewChild("fm1", {static: false}) public fm1: NgForm;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.grade = data.grade;

                this.oldData = JSON.stringify(data.grade);
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "افزودن پایه تحصیلی";
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش پایه تحصیلی " + this.grade.name;
                    this.btnTitle = "ویرایش";
                    this.isEdit = true;
                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }
        });

        this.auth.post("/api/Titute/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.titutes = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );

        this.auth.post("/api/Yeareducation/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.yeareducations = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
        this.auth.post("/api/Grade/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.grades = data.data;
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
        let title = "grade";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty && !this.isEdit) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.grade)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

    copySelectedData(id) {
        if (id != 0) {
            this.auth.post("/api/Grade/getGrade", id).subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        this.grade = data.data;
                        this.grade.id = 0;
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
                this.auth.post("/api/Grade/Edit", this.grade, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Edit Grade',
                    logSource: 'dashboard',
                    object: this.grade,
                    oldObject: JSON.parse(this.oldData),
                    table: "Grade",
                    tableObjectIds: [this.grade.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/grade"]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/Grade/Add", this.grade, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName:'Add Grade',
                    logSource: 'dashboard',
                    object: this.grade,
                    table: "Grade",
                    tableObjectIds: [this.grade.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/grade"]);
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
