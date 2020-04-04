import { Component, ViewChild, AfterViewInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { ITeacher } from "../teacher";
import { IOrgPerson } from "../../orgperson/orgperson";

declare var $: any;

@Component({
    templateUrl: "./teacher-edit.component.html"
})
export class TeacherEditComponent implements AfterViewInit, OnDestroy {

    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    teacher: ITeacher;

    oldData = null;

    orgpersons: IOrgPerson[] = [];

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.teacher = data.teacher;

                this.oldData = JSON.stringify(data.teacher);
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "افزودن دبیر";
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش دبیر " + this.teacher.name;
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
    }

    ngOnDestroy(): void {
        let title = "teacher";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty && !this.isEdit) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.teacher)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

    ngAfterViewInit(): void {

    }

    onPersonSelect() {
        this.teacher.name = "";

        if (this.teacher.orgPersonId) {

            var person = this.orgpersons.find(c => c.id == this.teacher.orgPersonId);

            this.teacher.name = person.name.slice(0, person.name.indexOf("-"));
        }

    }

    sts() {
        if (this.fm1.valid) {
            if (this.isEdit) {
                this.auth.post("/api/Teacher/Edit", this.teacher, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Teacher',
                    logSource: 'dashboard',
                    object: this.teacher,
                    oldObject: JSON.parse(this.oldData)
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/teacher"]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/Teacher/Add", this.teacher, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Teacher',
                    logSource: 'dashboard',
                    object: this.teacher,
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/teacher"]);
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