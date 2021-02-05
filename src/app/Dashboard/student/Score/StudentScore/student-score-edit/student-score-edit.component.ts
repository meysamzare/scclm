import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IStudentScore } from '../student-score';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { IStudent } from '../../../student';
import { IScoreThemplate } from '../../ScoreThemplate/score-themplate';
import { StdClassMng } from '../../../stdClassMng';
import { ITeacher } from 'src/app/Dashboard/teacher/teacher';

@Component({
    selector: 'app-student-score-edit',
    templateUrl: './student-score-edit.component.html',
    styleUrls: ['./student-score-edit.component.scss']
})
export class StudentScoreEditComponent implements OnInit, OnDestroy {
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    PAGE_Data: IStudentScore;

    oldData = null;

    PAGE_TITLE = " امتیاز دانش آموز ";
    PAGE_TITLES = " امتیازات دانش آموزان ";
    PAGE_APIURL = "StudentScore";
    PAGE_URL = "student/student-score";

    students: IStudent[] = [];

    scoreThemplates: IScoreThemplate[] = [];
    selectedScoreThemplate: number = null;

    stdClassMngByStudent: StdClassMng[] = [];

    teachers: ITeacher[] = [];

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.PAGE_Data = data.studentScore;

                this.oldData = JSON.stringify(data.studentScore);
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "ثبت " + this.PAGE_TITLE;
                this.btnTitle = "ثبت";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش " + this.PAGE_TITLE + this.PAGE_Data.studentFullName;
                    this.btnTitle = "ویرایش";
                    this.isEdit = true;

                    this.onStudentSelect(true);
                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }

            this.auth.post("/api/StdClassMng/getAllRegistredStudent").subscribe(data => {
                if (data.success) {
                    this.students = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

            this.auth.post("/api/ScoreThemplate/getAll").subscribe(data => {
                if (data.success) {
                    this.scoreThemplates = data.data;

                    if (this.isEdit) {
                        var scoreThemplate = this.scoreThemplates.find(c =>
                            c.title == this.PAGE_Data.title &&
                            c.type == this.PAGE_Data.type &&
                            c.subject == this.PAGE_Data.subject
                        );

                        if (scoreThemplate) {
                            this.selectedScoreThemplate = scoreThemplate.id;
                        }
                    }
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

            this.auth.post("/api/Teacher/getAll").subscribe(data => {
                if (data.success) {
                    this.teachers = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

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

    onStudentSelect(first = false) {
        var selectedStudent = this.PAGE_Data.studentId;
        if (selectedStudent) {
            if (first == false) {
                this.PAGE_Data.stdClassMngId = null;
            }
            this.auth.post("/api/StdClassMng/getAllbyStd", selectedStudent).subscribe(data => {
                if (data.success) {
                    this.stdClassMngByStudent = data.data;

                    var stdClassMng = this.stdClassMngByStudent.find(c => c.isActive == true);
                    if (stdClassMng) {
                        this.PAGE_Data.stdClassMngId = stdClassMng.id;
                    }
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }
    }

    onScoreThemplateSelect() {
        if (this.selectedScoreThemplate) {
            var scoreThemplate = this.scoreThemplates.find(c => c.id == this.selectedScoreThemplate);

            if (scoreThemplate) {
                this.PAGE_Data.title = scoreThemplate.title;
                this.PAGE_Data.type = scoreThemplate.type;
                this.PAGE_Data.subject = scoreThemplate.subject;
                this.PAGE_Data.value = scoreThemplate.value;
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
