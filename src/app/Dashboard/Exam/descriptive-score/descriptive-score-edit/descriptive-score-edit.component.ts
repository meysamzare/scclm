import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { IDescriptiveScore } from '../descriptive-score';

@Component({
    selector: 'app-descriptive-score-edit',
    templateUrl: './descriptive-score-edit.component.html',
    styleUrls: ['./descriptive-score-edit.component.scss']
})
export class DescriptiveScoreEditComponent implements OnInit {

    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    PAGE_Data: IDescriptiveScore;

    oldData = null;

    PAGE_TITLE = " نمره توصیفی ";
    PAGE_TITLES = " نمرات توصیفی ";
    PAGE_APIURL = "DescriptiveScore";
    PAGE_URL = "descriptive-score";

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        public auth: AuthService
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.PAGE_Data = data.onlineClass;

                this.oldData = JSON.stringify(data.onlineClass);
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "افزودن " + this.PAGE_TITLE;
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش " + this.PAGE_TITLE + this.PAGE_Data.name;
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
                this.auth.post("/api/" + this.PAGE_APIURL + "/Edit", this.PAGE_Data, {
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
                this.auth.post("/api/" + this.PAGE_APIURL + "/Add", this.PAGE_Data, {
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
