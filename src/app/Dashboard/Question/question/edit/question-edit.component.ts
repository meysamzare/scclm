import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from "@angular/core";
import { NgForm, NgModel } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { IQuestion } from "../question";
import { ICourse } from "src/app/Dashboard/course/course";
import { IGrade } from "src/app/Dashboard/grade/grade";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";

@Component({
    templateUrl: "./question-edit.component.html"
})
export class QuestionEditComponent implements AfterViewInit, OnInit, OnDestroy {
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    question: IQuestion;

    oldData = null;

    courses: ICourse[] = [];
    grades: IGrade[] = [];

    persones: string[] = [];
    filteredPerson: Observable<string[]>;

    @ViewChild("fm1", {static: false}) public fm1: NgForm;
    @ViewChild("person", { static: false }) public person: NgModel;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.question = data.question;

                this.oldData = JSON.stringify(data.question);
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "تعریف سوال";
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش " + this.question.name;
                    this.btnTitle = "ویرایش";
                    this.isEdit = true;
                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }
        });

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
        this.auth.post("/api/Course/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.courses = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );

        this.auth.post("/api/Question/getAllPersons", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.persones = data.data;
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
        let title = "question";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty && !this.isEdit) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify(this.question)
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

    ngAfterViewInit(): void {}
    ngOnInit(): void {
        this.filteredPerson = this.person.valueChanges.pipe(
            startWith(""),
            map(value => this._filter(value))
        );
    }

    private _filter(value: string): string[] {
        const filterValue = value;

        return this.persones.filter(option => option.includes(filterValue));
    }

    checkForTrueMark() {
        if (this.question.mark.toString().startsWith("-")) {
            this.question.mark = 0;
        }
    }

    sts() {
        if (this.fm1.valid) {
            if (this.isEdit) {
                this.auth.post("/api/Question/Edit", this.question, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Question',
                    logSource: 'dashboard',
                    object: this.question,
                    oldObject: JSON.parse(this.oldData),
                    table: "Question",
                    tableObjectIds: [this.question.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/question"]);
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {
                this.auth.post("/api/Question/Add", this.question, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName:'Question',
                    logSource: 'dashboard',
                    object: this.question,
                    table: "Question",
                    tableObjectIds: [this.question.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.route.navigate(["/dashboard/question"]);
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
