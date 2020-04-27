import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { IStudentType } from '../student-type';

@Component({
    selector: 'app-student-type-edit',
    templateUrl: './student-type-edit.component.html',
    styleUrls: ['./student-type-edit.component.scss']
})
export class StudentTypeEditComponent implements OnInit, OnDestroy {
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    PAGE_Data: IStudentType;

    oldData = null;

    PAGE_TITLE = " گروه دانش آموز ";
    PAGE_TITLES = " گروه های دانش آموز ";
    PAGE_APIURL = "StudentType";
    PAGE_URL = "student/student-type";

    @ViewChild("fm1", {static: false}) public fm1: NgForm;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.PAGE_Data = data.studentType;

                this.oldData = JSON.stringify(data.studentType);
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "افزودن " + this.PAGE_TITLE;
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش "+ this.PAGE_TITLE + this.PAGE_Data.name;
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
        let title = this.PAGE_APIURL;
        if (!this.fm1.submitted) {
            if (this.fm1.dirty && !this.isEdit) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.PAGE_Data)
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
                this.auth.post("/api/"+ this.PAGE_APIURL +"/Edit", this.PAGE_Data, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: this.PAGE_APIURL,
                    logSource: 'dashboard',
                    object: this.PAGE_Data,
                    oldObject: JSON.parse(this.oldData),
                    table: this.PAGE_APIURL,
                    tableObjectIds: [this.PAGE_Data.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/" + this.PAGE_URL]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/"+ this.PAGE_APIURL +"/Add", this.PAGE_Data, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: this.PAGE_APIURL,
                    logSource: 'dashboard',
                    object: this.PAGE_Data,
                    table: this.PAGE_APIURL,
                    tableObjectIds: [this.PAGE_Data.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/" + this.PAGE_URL]);
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

    ngOnInit() {
    }

}
