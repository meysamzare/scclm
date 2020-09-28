import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeacherAuthService } from '../../services/teacher-auth.service';
import { IGrade } from 'src/app/Dashboard/grade/grade';
import { ICourse } from 'src/app/Dashboard/course/course';
import { IClass } from 'src/app/Dashboard/class/class';
import { IStudent } from 'src/app/Dashboard/student/student';
import { SetClassBookService } from './set-class-book/set-class-book.service';
import { Router } from '@angular/router';
import { ClassBookService } from './class-book.service';

@Component({
    selector: 'app-class-book',
    templateUrl: './class-book.component.html',
    styleUrls: ['./class-book.component.scss']
})
export class ClassBookComponent implements OnInit, OnDestroy {

    teacherId = this.tchAuth.getTeacherId();

    teacherGrades: IGrade[] = [];
    selectedGrade: number = null;
    selectedGradeName = "";

    selectedYeareducationId: number = null;
    selectedTituteId: number = null;


    teacherCourseByGrade: ICourse[] = [];
    selectedCourse: number = null;
    selectedCourseName = "";

    classByGrade: IClass[] = [];
    selectedClass: number = null;
    selectedClassName = "";

    studentByClass: IStudent[] = [];

    havePrivData = false;

    search = "";

    isLoading = true;

    constructor(
        public tchAuth: TeacherAuthService,
        private setClassBookSrv: SetClassBookService,
        private router: Router,
        private classBookDataSrv: ClassBookService
    ) { }

    ngOnInit() {

        if (this.tchAuth.getTeacher().allCourseAccess) {
            this.tchAuth.auth.post("/api/Grade/getAll", null, {
                type: 'View',
                agentId: this.tchAuth.getTeacherId(),
                agentType: 'Teacher',
                agentName: this.tchAuth.getTeacherName(),
                tableName: 'Entring To ClassBookList Page With AllCourseAccess',
                logSource: 'TMA',
                object: null,
            }).subscribe(data => {
                if (data.success) {
                    this.teacherGrades = data.data;
                } else {
                    this.tchAuth.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.tchAuth.auth.handlerError(er);
            });
        } else {
            this.tchAuth.auth.post("/api/Grade/getAllByTeacher", this.teacherId, {
                type: 'View',
                agentId: this.tchAuth.getTeacherId(),
                agentType: 'Teacher',
                agentName: this.tchAuth.getTeacherName(),
                tableName: 'Entring To ClassBookList Page',
                logSource: 'TMA',
                object: null,
            }).subscribe(data => {
                if (data.success) {
                    this.teacherGrades = data.data;
                } else {
                    this.tchAuth.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.tchAuth.auth.handlerError(er);
            });
        }


        this.classBookDataSrv.isAnyData().subscribe(haveData => {


            if (haveData) {

                this.classBookDataSrv.getClassBookData().subscribe(data => {

                    if (data.accessToAllCourse != this.tchAuth.getTeacher().allCourseAccess) {
                        this.havePrivData = false;

                        this.classBookDataSrv.clearData();
                    } else {
                        this.havePrivData = haveData;

                        this.studentByClass = data.studentByClass;
                        this.selectedClass = data.selectedClass;
                        this.selectedCourse = data.selectedCourse;
                        this.selectedGrade = data.selectedGrade;
                        this.selectedTituteId = data.selectedTituteId;
                        this.selectedYeareducationId = data.selectedYeareducationId;

                        this.selectedClassName = data.className;
                        this.selectedGradeName = data.gradeName;
                        this.selectedCourseName = data.courseName;

                    }
                    this.isLoading = false;
                });
            }

        });

    }

    ngOnDestroy(): void {
        if (this.studentByClass.length != 0) {
            this.classBookDataSrv.setClassBookData({
                selectedClass: this.selectedClass,
                selectedCourse: this.selectedCourse,
                selectedGrade: this.selectedGrade,
                selectedTituteId: this.selectedTituteId,
                selectedYeareducationId: this.selectedYeareducationId,
                studentByClass: this.studentByClass,
                className: this.selectedClassName,
                gradeName: this.selectedGradeName,
                courseName: this.selectedCourseName,
                accessToAllCourse: this.tchAuth.getTeacher().allCourseAccess
            });
        }
    }

    clearDatas() {
        this.selectedClass = null;
        this.selectedCourse = null;
        this.selectedGrade = null;
        this.selectedTituteId = null;
        this.selectedYeareducationId = null;
        this.studentByClass = [];

        this.search = "";
    }

    removePerivData() {
        this.clearDatas();

        this.classBookDataSrv.clearData();

        this.havePrivData = false;
    }

    getFiltredStudents(): IStudent[] {
        if (this.search) {
            return this.studentByClass.filter(c => (c.name + ' ' + c.lastName).includes(this.search));
        }

        return this.studentByClass;
    }

    onGradeSelect() {
        if (this.selectedGrade) {

            var selectedGrade = this.teacherGrades.find(c => c.id == this.selectedGrade);

            this.selectedYeareducationId = selectedGrade.yeareducationId;
            this.selectedTituteId = selectedGrade.tituteId;

            this.selectedGradeName = selectedGrade.name;

            if (this.tchAuth.getTeacher().allCourseAccess) {
                this.tchAuth.auth.post("/api/Course/getAllByGrade", this.selectedGrade).subscribe(data => {
                    if (data.success) {
                        this.teacherCourseByGrade = data.data;
                    } else {
                        this.tchAuth.auth.message.showMessageforFalseResult(data);
                    }
                }, er => {
                    this.tchAuth.auth.handlerError(er);
                });
            } else {
                this.tchAuth.auth.post("/api/Course/getAllByTeacherGrade", {
                    teacherId: this.teacherId,
                    gradeId: this.selectedGrade
                }).subscribe(data => {
                    if (data.success) {
                        this.teacherCourseByGrade = data.data;
                    } else {
                        this.tchAuth.auth.message.showMessageforFalseResult(data);
                    }
                }, er => {
                    this.tchAuth.auth.handlerError(er);
                });
            }

            this.tchAuth.auth.post("/api/Class/getClassByGrade", this.selectedGrade).subscribe(data => {
                if (data.success) {
                    this.classByGrade = data.data;
                } else {
                    this.tchAuth.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.tchAuth.auth.handlerError(er);
            });
        }
    }

    onCourseSelect() {
        if (this.selectedCourse) {
            this.selectedCourseName = this.teacherCourseByGrade.find(c => c.id == this.selectedCourse).name;
        }
    }

    onClassSelect() {
        if (this.selectedClass) {

            this.selectedClassName = this.classByGrade.find(c => c.id == this.selectedClass).name;

            this.tchAuth.auth.post("/api/Student/getAllInClass", this.selectedClass, {
                type: 'View',
                agentId: this.tchAuth.getTeacherId(),
                agentType: 'Teacher',
                agentName: this.tchAuth.getTeacherName(),
                tableName: 'Select Class In ClassBook Page (Viewing Student List)',
                logSource: 'TMA',
                object: {
                    allCourseAccess: this.tchAuth.getTeacher().allCourseAccess,
                    selectedGradeName: this.selectedGradeName + '(' + this.selectedGrade + ')',
                    selectedCourseName: this.selectedCourseName + '(' + this.selectedCourse + ')',
                    selectedClassName: this.selectedClassName + '(' + this.selectedClass + ')',
                },
            }).subscribe(data => {
                if (data.success) {
                    this.studentByClass = data.data;
                } else {
                    this.tchAuth.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.tchAuth.auth.handlerError(er);
            });
        }
    }

    goToSetClassBook(stdId = null, type, forAll = false) {

        if (!forAll) {


            var std = this.studentByClass.find(c => c.id == stdId);

            var stdName = `${std.name} ${std.lastName}`;

            this.setClassBookSrv.setData(
                this.selectedTituteId,
                this.selectedYeareducationId,
                this.selectedGrade,
                this.selectedClass,
                this.selectedCourse,
                this.teacherId,
                type,
                stdId,
                stdName,
                forAll,
                this.studentByClass
            );
        } else {

            this.setClassBookSrv.setData(
                this.selectedTituteId,
                this.selectedYeareducationId,
                this.selectedGrade,
                this.selectedClass,
                this.selectedCourse,
                this.teacherId,
                type,
                null,
                null,
                forAll,
                this.studentByClass
            );
        }

        this.router.navigate(["/class-book/set-class-book"]);
    }

    goToViewStudent(id) {
        this.router.navigateByUrl("/class-book/view-student/" + id);
    }

}
