import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IClassBook, getClassBookTypeString, ClassBookRegisterType, ClassBookType, getDesiplineTypeString } from '../class-book';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { IGrade } from 'src/app/Dashboard/grade/grade';
import { IClass } from 'src/app/Dashboard/class/class';
import { ITeacher } from 'src/app/Dashboard/teacher/teacher';
import { IYeareducation } from 'src/app/Dashboard/yeareducation/yeareducation';
import { ICourse } from 'src/app/Dashboard/course/course';
import { IExam } from 'src/app/Dashboard/Exam/exam/exam';
import { IStudent } from '../../student';
import { ITitute } from 'src/app/Dashboard/titute/titute';
import { StdClassMng } from '../../stdClassMng';

@Component({
    selector: 'app-class-book-edit',
    templateUrl: './class-book-edit.component.html',
    styleUrls: ['./class-book-edit.component.scss']
})
export class ClassBookEditComponent implements OnInit, OnDestroy {

    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    PAGE_Data: IClassBook = new IClassBook();

    oldData = null;

    PAGE_TITLE = " دفتر کلاسی ";
    PAGE_TITLES = " گزارش کلاسی ";
    PAGE_APIURL = "ClassBook";
    PAGE_URL = "student/class-book";

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    students: IStudent[] = [];
    grades: IGrade[] = [];
    classes: IClass[] = [];
    teachers: ITeacher[] = [];
    yeareducations: IYeareducation[] = [];
    courses: ICourse[] = [];
    titutes: ITitute[] = [];

    exams: IExam[] = [];

    disiplineTypeSelected = null;
    disiplineText = "";

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        private auth: AuthService
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.PAGE_Data = data.classBook;

                this.oldData = JSON.stringify(data.classBook);
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "ثبت " + this.PAGE_TITLE;
                this.btnTitle = "ثبت";
                this.isEdit = false;

                this.PAGE_Data.registerId = this.auth.getUserId();
                this.PAGE_Data.registerType = ClassBookRegisterType.User;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش " + this.PAGE_TITLE;
                    this.btnTitle = "ویرایش";
                    this.isEdit = true;
                } else {
                    this.message.showWarningAlert("invalid Data");
                    this.route.navigate(["/dashboard"]);
                }
            }

            var type = this.PAGE_Data.type;

            if (type) {
                if (type == 1) {
                    this.getAllExams();
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

    getAllExams() {
        this.auth.post("/api/Exam/getAllByTeacher", this.PAGE_Data.teacherId).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.exams = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
    }

    getClassBookTypeString(type) {
        return getClassBookTypeString(type);
    }

    onTypeChaneg() {
        this.PAGE_Data.value = "";
        this.PAGE_Data.examId = null;

        var type = this.PAGE_Data.type;

        if (type) {
            if (type == 1) {
                this.getAllExams();
            }
        }
    }

    onExamSelect() {
        this.PAGE_Data.value = "";

        if (this.PAGE_Data.examId) {
            this.PAGE_Data.examName = this.exams.find(c => c.id == this.PAGE_Data.examId).name;
        }
    }


    setTeacherIdByCourse() {
        if (this.PAGE_Data.courseId) {
            var course = this.courses.find(c => c.id == this.PAGE_Data.courseId);
            if (course) {
                this.PAGE_Data.teacherId = course.teacherId;
            }
        }
    }

    onStudentSelected() {
        if (this.PAGE_Data.studentId) {
            var activeStdClassMng = this.getActiveStdClassMngByStudent(this.PAGE_Data.studentId);

            if (activeStdClassMng) {
                this.PAGE_Data.insTituteId = activeStdClassMng.insTituteId;
                this.PAGE_Data.yeareducationId = activeStdClassMng.yeareducationId;
                this.PAGE_Data.gradeId = activeStdClassMng.gradeId;
                this.PAGE_Data.classId = activeStdClassMng.classId;
            }
        }
    }

    getActiveStdClassMngByStudent(stdId): StdClassMng | null {
        var stdClassMngs: StdClassMng[] = (this.students.find(c => c.id == stdId) as any).stdClassMngs;

        return stdClassMngs.find(c => c.isActive == true);
    }

    getDesiplineTypeString(type) {
        return getDesiplineTypeString(type);
    }

    combileDsiplineDesc(text) {

    }

    openc(picker1) {
        picker1.open();
    }

    ngOnInit() {


        this.auth.post("/api/Student/getAllHaveStdClassMng", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.students = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );


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
        this.auth.post("/api/Class/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.classes = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
        this.auth.post("/api/Teacher/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.teachers = data.data;
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
    }

    sts() {
        if (this.fm1.valid) {
            if (this.PAGE_Data.type == 4) {
                this.PAGE_Data.value = `${this.getDesiplineTypeString(this.disiplineTypeSelected)} - ${this.disiplineText}`;
            }
            if (this.isEdit) {
                this.auth.post("/api/" + this.PAGE_APIURL + "/Edit", this.PAGE_Data, {
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'ClassBook',
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
                    tableName: 'ClassBook',
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

    isScoreValid(): boolean {
        if (this.PAGE_Data.type == ClassBookType.ExamScore) {
            if (this.PAGE_Data.examId) {
                var exam = this.exams.find(c => c.id == this.PAGE_Data.examId);

                if (exam) {
                    if (+this.PAGE_Data.value > exam.topScore || +this.PAGE_Data.value < 0) {
                        return false;
                    } else {
                        return true;
                    }
                }

            }

            return true;
        }

        return true;
    }

    getSelectedExam() {
        var exam = this.exams.find(c => c.id == this.PAGE_Data.examId);

        return exam;
    }


}
