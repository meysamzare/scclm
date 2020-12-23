import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from "@angular/core";
import { NgForm, NgModel } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { IQuestion } from "../question";
import { ICourse } from "src/app/Dashboard/course/course";
import { IGrade } from "src/app/Dashboard/grade/grade";
import { Observable } from "rxjs";
import { startWith, map, finalize } from "rxjs/operators";
import { IQuestionOption } from "../../questionoption/questionoption";
import Swal from "sweetalert2";
import { Location } from "@angular/common";
import { PictureSelectModalComponent } from "src/app/html-tools/picture-select-modal/picture-select-modal.component";
import { MatDialog } from "@angular/material";

@Component({
    templateUrl: "./question-edit.component.html",
    styles: [
        `
            .panel-main.disabled {
                pointer-events: none; 
                opacity: 0.5;
            }
        `
    ]
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

    @ViewChild("fm1", { static: false }) public fm1: NgForm;
    @ViewChild("person", { static: false }) public person: NgModel;

    options: IQuestionOption[] = [];

    isLoading = false;

    editOptionIndex: number = null;

    autoCounter = false;
    counter = 1;

    examTitle = "";

    Id = "0";

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService,
        public location: Location,
        private dialog: MatDialog
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.question = data.question;

                this.oldData = JSON.stringify(data.question);
            });

            this.Id = params["id"];

            if (this.Id === "0") {
                this.Title = "تعریف سوال";
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(this.Id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش " + this.question.name;
                    this.btnTitle = "ویرایش";
                    this.isEdit = true;

                    this.refreshOptions();
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

    autoSetQuestionName() {
        if (!this.isEdit) {

            let gradeName = "";
            let courseName = "";

            if (this.question.gradeId) {
                gradeName = this.grades.find(c => c.id == this.question.gradeId).name;
            }

            if (this.question.courseId) {
                courseName = this.courses.find(c => c.id == this.question.courseId).name;
            }

            if (this.autoCounter) {
                this.question.name = `${gradeName} ${courseName} ${this.examTitle} سوال شماره ${this.counter}`;
            } else {
                this.question.name = `${gradeName} ${courseName}`;
            }
            
        }
    }

    addOptionTemp() {

        this.options.push({
            id: 0,
            title: `${this.question.name || ""} گزینه ${this.options.length + 1}`,
            isTrue: false,
            name: "",
            questionId: this.question.id || 0,
            questionName: ""
        });

        this.editOptionIndex = this.options.length - 1;
    }

    deleteOption(option: IQuestionOption) {

        let value = confirm("آیا از حذف این مورد اطمینان دارید؟");

        if (value) {
            if (this.isEdit && option.id != 0) {

                this.auth.post("/api/QuestionOption/Delete", [option.id]).subscribe(data => {
                    if (data.success) {
                        this.refreshOptions();

                        this.message.showSuccessAlert("با موفقیت حذف شد");
                    } else {
                        this.message.showMessageforFalseResult(data);
                    }
                }, er => {
                    this.auth.handlerError(er);
                });

            } else {
                this.options.splice(this.options.findIndex(c => c == option), 1);
            }
        }
    }

    editOption(option) {
        if (this.isEdit) {
            this.auth.post(`/api/QuestionOption/${option.id == 0 ? 'Add' : 'Edit'}`, option).subscribe(data => {
                if (data.success) {
                    this.refreshOptions();

                    this.message.showSuccessAlert("با موفقیت ثبت شد");

                    this.editOptionIndex = null;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }
    }

    setIsTrueOPtion(option) {
        if (this.isEdit) {
            this.auth.post("/api/Question/SetTrueOption", option).subscribe(data => {
                if (data.success) {
                    this.refreshOptions();

                    this.message.showSuccessAlert("با موفقیت ثبت شد");
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        } else {
            this.options.forEach(op => op.isTrue = false);

            this.options.find(c => c == option).isTrue = !option.isTrue;
        }
    }

    refreshOptions() {
        this.isLoading = true;
        this.auth.post("/api/Question/getOptions", this.Id)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe(data => {
                if (data.success) {
                    this.options = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
    }

    onCourseSelect() {
        const courseId = this.question.courseId;
        const course = this.courses.find(c => c.id == courseId);

        if (course) {
            this.question.person = course.teacherName;
        }
    }

    getCourseByGrade() {
        let gradeId = this.question.gradeId;

        if (gradeId) {
            return this.courses.filter(c => c.gradeId == gradeId);
        }

        return [];
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

    ngAfterViewInit(): void { }

    getFiltredPersons() {
        let value = this.question.person;

        if (value) {
            return this.persones.filter(c => c.includes(value));
        }

        return this.persones;
    }

    ngOnInit(): void {
        if (this.person) {
            this.filteredPerson = this.person.valueChanges.pipe(
                startWith(""),
                map(value => this._filter(value))
            );
        }
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
                    tableObjectIds: [this.question.id, ...this.options.map(c => c.id)]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.location.back();
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            } else {

                let obj = {
                    question: this.question,
                    options: this.options
                }

                this.auth.post("/api/Question/Add", obj, {
                    type: 'Add',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Question',
                    logSource: 'dashboard',
                    object: obj,
                    table: "Question",
                    tableObjectIds: [this.question.id]
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert("با موفقیت ثبت شد");

                            this.clearForm();

                            if (this.autoCounter) {
                                this.counter = Number(this.counter) + 1;
                                this.autoSetQuestionName();
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
        } else {
            this.message.showWarningAlert("مقادیر خواسته شده را تکمیل نمایید");
        }
    }



    clearForm() {
        this.question.id = 0;
        this.question.type = null;
        this.question.answer = '';
        this.question.source = '';
        this.question.mark = 1;
        this.question.desc1 = '';
        this.question.desc2 = '';

        this.question.title = '';
        this.question.complatabelContent = '';

        this.options = [];
    }


    onQuestionTypeSelect() {
        if (!this.isEdit && this.question.type == 2) {
            this.options = [];

            for (let index = 0; index < 4; index++) {
                this.options.push({
                    id: 0,
                    isTrue: false,
                    title: `${this.question.name || ""} گزینه ${index + 1}`,
                    questionId: this.question.id,
                    name: "",
                    questionName: this.question.name || ""
                });
            }
        }
    }
}
