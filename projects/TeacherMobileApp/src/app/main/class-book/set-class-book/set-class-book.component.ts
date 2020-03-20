import { Component, OnInit } from '@angular/core';
import { SetClassBookService } from './set-class-book.service';
import { Router } from '@angular/router';
import { getClassBookTypeString, IClassBook, ClassBookType, getDesiplineTypeString } from 'src/app/Dashboard/student/class-book/class-book';
import { IExam } from 'src/app/Dashboard/Exam/exam/exam';
import { TeacherAuthService } from '../../../services/teacher-auth.service';
import { IStudent } from 'src/app/Dashboard/student/student';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

export const slideOutLeft = [
    style({ transform: 'translate3d(0, 0, 0)', offset: 0 }),
    style({ transform: 'translate3d(-150%, 0, 0)', opacity: 0, offset: 1 }),
]

@Component({
    selector: 'app-set-class-book',
    templateUrl: './set-class-book.component.html',
    styleUrls: ['./set-class-book.component.scss'],
    // animations: [
    //     trigger("nameSlide", [
    //         state("slideLeft", animate(1000,
    //             style({ transform: 'translate3d(0, 0, 0)', offset: 0 }),
    //             style({ transform: 'translate3d(-150%, 0, 0)', opacity: 0}),
    //         ))
    //     ])
    // ]
})
export class SetClassBookComponent implements OnInit {

    classBook: IClassBook = new IClassBook();

    Title = "";

    studentName = "";

    studentPicUrl = "";

    teacherExams: IExam[] = [];

    isLoading = false;

    ViewedStudentIndex = 0;
    Students: IStudent[] = [];

    rightToLeft = false;

    disiplineTypeSelected = null;
    disiplineText = "";

    constructor(
        private setClassBookSrv: SetClassBookService,
        private router: Router,
        public tchAuth: TeacherAuthService
    ) { }

    ngOnInit() {
        if (!this.setClassBookSrv.haveAnyData()) {
            alert("a");

            this.router.navigate(["../"]);
        }

        if (!this.setClassBookSrv.forAllStudent) {
            this.studentName = this.setClassBookSrv.studentName;
            this.classBook.studentId = this.setClassBookSrv.studentId;
        } else {
            if (this.setClassBookSrv.students.length == 0) {
                alert("b");
                this.router.navigateByUrl("/");
            }

            this.Students = this.setClassBookSrv.students;

            this.setViewedStudent();
        }

        this.classBook.insTituteId = this.setClassBookSrv.insTituteId;
        this.classBook.yeareducationId = this.setClassBookSrv.yeareducationId;
        this.classBook.gradeId = this.setClassBookSrv.gradeId;
        this.classBook.classId = this.setClassBookSrv.classId;
        this.classBook.courseId = this.setClassBookSrv.courseId;
        this.classBook.teacherId = this.setClassBookSrv.teacherId;
        this.classBook.type = this.setClassBookSrv.type;

        this.Title = this.getTitle();

        this.tchAuth.auth.logToServer({
            type: 'View',
            agentId: this.tchAuth.getTeacherId(),
            agentType: 'Teacher',
            agentName: this.tchAuth.getTeacherName(),
            tableName: 'Entring To Set ClassBook Page',
            logSource: 'TMA',
            object: {
                classBook: this.classBook,
                title: this.Title,
                forAllStudent: this.setClassBookSrv.forAllStudent,
                students: this.Students,

            },
        });

        if (this.classBook.type == ClassBookType.ExamScore) {
            this.tchAuth.auth.post("/api/Exam/getAllByTeacher", this.tchAuth.getTeacherId()).subscribe(
                data => {
                    if (data.success) {
                        this.teacherExams = data.data;


                        this.tchAuth.auth.logToServer({
                            type: 'View',
                            agentId: this.tchAuth.getTeacherId(),
                            agentType: 'Teacher',
                            agentName: this.tchAuth.getTeacherName(),
                            tableName: 'Entring To Set ClassBook Page',
                            logSource: 'TMA',
                            object: {
                                classBook: this.classBook,
                                title: this.Title,
                                forAllStudent: this.setClassBookSrv.forAllStudent,
                                students: this.Students,
                                teacherExams: this.teacherExams
                            },
                        });
                        
                    } else {
                        this.tchAuth.auth.message.showMessageforFalseResult(data);
                    }
                },
                er => {
                    this.tchAuth.auth.handlerError(er);
                }
            );
        } else {

            this.tchAuth.auth.logToServer({
                type: 'View',
                agentId: this.tchAuth.getTeacherId(),
                agentType: 'Teacher',
                agentName: this.tchAuth.getTeacherName(),
                tableName: 'Entring To Set ClassBook Page',
                logSource: 'TMA',
                object: {
                    classBook: this.classBook,
                    title: this.Title,
                    forAllStudent: this.setClassBookSrv.forAllStudent,
                    students: this.Students
                },
            });
        }
    }

    getTitle(): string {
        var title = "ثبت ";

        return title + getClassBookTypeString(this.setClassBookSrv.type);
    }

    setViewedStudent() {
        var student = this.Students[this.ViewedStudentIndex];

        this.studentName = `${student.name} ${student.lastName}`;
        this.studentPicUrl = student.picUrl;
        this.classBook.studentId = student.id;
    }

    nextStudent() {
        if (this.isAnyNextStudent()) {
            this.ViewedStudentIndex += 1;

            this.setViewedStudent();
        }
    }

    isAnyNextStudent(): boolean {
        if (this.ViewedStudentIndex + 1 > this.Students.length - 1) {
            return false;
        }

        return true;
    }

    prevStudent() {
        if (this.isAnyPrevStudent()) {
            this.ViewedStudentIndex -= 1;

            this.setViewedStudent();
        }
    }

    isAnyPrevStudent(): boolean {
        if (this.ViewedStudentIndex - 1 < 0) {
            return false;
        }

        return true;
    }

    onSwipeLeft() {
        this.nextStudent();
    }

    onSwipeRight() {
        this.prevStudent();
    }

    isForAllStudent(): boolean {
        if (this.Students.length == 0) {
            return false;
        }

        return true;
    }

    isScoreValid(): boolean {
        if (this.classBook.type == ClassBookType.ExamScore) {
            if (this.classBook.examId) {
                var exam = this.teacherExams.find(c => c.id == this.classBook.examId);

                if (+this.classBook.value > exam.topScore || +this.classBook.value < 0) {
                    return false;
                } else {
                    return true;
                }
            }

            return false;
        }

        return true;
    }

    getSelectedExam() {
        var exam = this.teacherExams.find(c => c.id == this.classBook.examId);

        return exam;
    }


    getClassBookTypeString(type) {
        return getClassBookTypeString(type);
    }


    getDesiplineTypeString(type) {
        return getDesiplineTypeString(type);
    }

    onExamSelected() {
        this.classBook.value = "";
        if (this.classBook.examId) {
            this.classBook.examName = this.teacherExams.find(c => c.id == this.classBook.examId).name;
        }
    }

    clearValue() {
        this.classBook.value = "";
    }

    sts() {
        this.isLoading = true;

        if (this.classBook.type == 4) {
            this.classBook.value = `${this.getDesiplineTypeString(this.disiplineTypeSelected)} - ${this.disiplineText}`;
        }

        this.tchAuth.auth.post("/api/ClassBook/Add", this.classBook, {
            type: 'Add',
            agentId: this.tchAuth.getTeacherId(),
            agentType: 'Teacher',
            agentName: this.tchAuth.getTeacherName(),
            tableName: 'Add New ClassBook',
            logSource: 'TMA',
            object: this.classBook,
        }).subscribe(
            data => {
                if (data.success) {
                    this.tchAuth.auth.message.showSuccessAlert("با موفقیت ثبت شد");

                    if (!this.isForAllStudent()) {
                        this.router.navigate(["/class-book"]);
                    } else {
                        if (this.isAnyNextStudent()) {
                            this.clearValue();
                            this.nextStudent();
                        } else {
                            this.router.navigate(["/class-book"]);
                        }
                    }

                } else {
                    this.tchAuth.auth.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.tchAuth.auth.handlerError(er);
            },
            () => {
                this.isLoading = false;
            }
        );
    }


}
