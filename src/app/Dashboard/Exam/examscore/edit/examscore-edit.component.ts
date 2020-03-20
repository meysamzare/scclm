import { Component, ViewChild, HostListener } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { IExamScore } from "../examscore";
import { IExam } from "../../exam/exam";
import { IStudent } from "src/app/Dashboard/student/student";

declare var $: any;

@Component({
    templateUrl: "./examscore-edit.component.html"
})
export class ExamScoreEditComponent {
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    examscore: IExamScore;

    oldData = null;

    exams: IExam[] = [];

    exam: IExam;

    students: IStudent[] = [];

    isScoreValid = true;

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.examscore = data.examscore;

                this.oldData = JSON.stringify(data.examscore);
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "ثبت نمره";
                this.btnTitle = "ثبت";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش نمره : " + this.examscore.studentName;
                    this.btnTitle = "ویرایش";
                    this.isEdit = true;
                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }
        });

        this.auth.post("/api/Exam/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.exams = data.data;

                    if (this.isEdit) {
                        this.onExamSelect(this.examscore.examId);
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

    moveNextTabIndex(e) {
        if (e.srcElement.nextElementSibling) {
            e.srcElement.nextElementSibling.focus();
        }
        return;
    }

    getBlankAnswers() {
        if (
            this.examscore.trueAnswer != null &&
            this.examscore.falseAnswer != null &&
            this.examscore.numberQ != null
        ) {
            var plus = this.examscore.trueAnswer + this.examscore.falseAnswer;

            if (plus <= this.examscore.numberQ) {
                this.examscore.blankAnswer = this.examscore.numberQ - plus;
                return;
            }
            if (plus == this.examscore.numberQ) {
                this.examscore.blankAnswer = 0;
                return;
            }

            this.examscore.blankAnswer = null;
        } else {
            this.examscore.blankAnswer = null;
        }
    }

    checkForTrueAnswers() {
        if (
            this.examscore.trueAnswer != null &&
            this.examscore.falseAnswer != null &&
            this.examscore.blankAnswer != null
        ) {
            var plus =
                this.examscore.trueAnswer +
                this.examscore.falseAnswer +
                this.examscore.blankAnswer;

            if (plus > this.examscore.numberQ) {
                return false;
            }

            if (plus < 0) {
                return false;
            }

            return true;
        } else {
            return true;
        }
    }

    checkForScore(value) {
        if (value > this.examscore.topScore) {
            this.message.showWarningAlert(
                "نمره نمیتواند از ملاک نمره آزمون بیشتر باشد"
            );
            this.isScoreValid = false;

            return;
        }

        this.isScoreValid = true;
        return;
    }

    getStudentNameById(id) {
        if (id != 0) {
            var st = this.students.find(c => c.id == id);
            if (st) {
                return st.name + ' ' + st.lastName;
            }
        }
    }

    getSelectedExamName() {
        if (this.exam) {
            return this.exam.name;
        } else {
            return "";
        }
    }

    onExamSelect(id) {
        if (!this.isEdit) {
            this.resetForm();
            this.students = [];
            this.examscore.studentId = null;
            this.examscore.numberQ = null;
            this.examscore.topScore = null;
        }
        if (id) {
            this.auth.post("/api/Exam/getExam", id).subscribe(
                (data: jsondata) => {
                    this.exam = data.data;

                    if (!this.isEdit) {

                        this.examscore.numberQ = this.exam.numberQ;
                        this.examscore.topScore = this.exam.topScore;

                        this.resetForm();
                    }
                },
                er => {
                    this.auth.handlerError(er);
                }
            );


            this.auth.post("/api/Student/getStudentForExamScore", id).subscribe(
                (data: jsondata) => {
                    if (data.success) {
                        console.log(data);

                        this.students = data.data;

                        if (!this.isEdit) {
                            if (this.students) {
                                this.examscore.studentId = this.students[0].id;
                            }
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

    @HostListener("document:keydown.control.arrowright")
    moveToNextStudent() {
        if (!this.isEdit) {
            var nowIndex = this.students.findIndex(
                c => c.id == this.examscore.studentId
            );

            if (this.students.length - 1 == nowIndex) {
                this.message.showInfoAlert("دانش آموزی باقی نمانده است", "");
            } else {
                this.examscore.studentId = this.students[nowIndex + 1].id;
            }
        }
    }

    @HostListener("document:keydown.control.arrowleft")
    moveToPerevStudent() {
        if (!this.isEdit) {
            var nowIndex = this.students.findIndex(
                c => c.id == this.examscore.studentId
            );

            if (nowIndex === 0) {
                this.message.showInfoAlert("دانش آموزی باقی نمانده است", "");
            } else {
                this.examscore.studentId = this.students[nowIndex - 1].id;
            }
        }
    }

    resetForm() {
        this.examscore.score = null;
        this.examscore.blankAnswer = null;
        this.examscore.falseAnswer = null;
        this.examscore.trueAnswer = null;

        $("#scoreTxt").prop("disabled", false);
        $("#scoreTxt").focus();
    }

    @HostListener("document:keydown.control.enter")
    sts() {
        if (this.fm1.valid) {
            if (this.isEdit) {
                this.auth.post("/api/ExamScore/Edit", this.examscore, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'ExamScore',
                    logSource: 'dashboard',
                    object: this.examscore,
                    oldObject: JSON.parse(this.oldData)
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/examscore"]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/ExamScore/Add", this.examscore, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName:'ExamScore',
                    logSource: 'dashboard',
                    object: this.examscore,
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            var nowIndex = this.students.findIndex(
                                c => c.id == this.examscore.studentId
                            );

                            if (this.students.length - 1 == nowIndex) {
                                this.route.navigate(["/dashboard/examscore"]);
                            } else {
                                this.examscore.studentId = this.students[
                                    nowIndex + 1
                                ].id;
                            }

                            this.resetForm();
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
