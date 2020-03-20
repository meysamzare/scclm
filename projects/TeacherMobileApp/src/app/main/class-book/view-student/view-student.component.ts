import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassBookService } from '../class-book.service';
import { IStudent } from 'src/app/Dashboard/student/student';
import { TeacherAuthService } from '../../../services/teacher-auth.service';
import { IClassBook, getClassBookTypeString, getClassBookResult } from 'src/app/Dashboard/student/class-book/class-book';

@Component({
    selector: 'app-view-student',
    templateUrl: './view-student.component.html',
    styleUrls: ['./view-student.component.scss']
})
export class ViewStudentComponent implements OnInit {

    studentId = 0;
    student: IStudent = new IStudent();

    studentClassBooks: IClassBook[] = [];

    totalCount = 0;

    page = 1;

    isLoading = false;

    sort: "date" | "type" = "date";

    className = "";
    courseName = "";

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        public classBookDataSrv: ClassBookService,
        public tchAuth: TeacherAuthService
    ) {
        this.activeRoute.params.subscribe(params => {
            this.studentId = params["id"];

            this.classBookDataSrv.isAnyData().subscribe(isAnyData => {
                if (isAnyData) {
                    this.classBookDataSrv.getClassBookData().subscribe(classBookData => {
                        var student = classBookData.studentByClass.find(c => c.id == this.studentId);

                        if (student) {
                            this.student = student;

                            this.courseName = classBookData.courseName;
                            this.className = classBookData.className;

                            this.refreshClassBooks(true);
                        } else {
                            this.route.navigate(["class-book"]);
                        }
                    });
                } else {
                    this.route.navigate(["class-book"]);
                }
            });
        });
    }

    ngOnInit() { }

    getClassBookTypeString(type) {
        return getClassBookTypeString(type);
    }

    getClassBookResult(type, value, examName) {
        return getClassBookResult(type, value, examName);
    }

    refreshClassBooks(clear = false) {
        this.isLoading = true;
        if (clear) {
            this.page = 1;
        }
        this.tchAuth.auth.post("/api/ClassBook/getByStudent", {
            studentId: this.studentId,
            teacherId: this.tchAuth.getTeacherId(),
            page: this.page,
            sort: this.sort,
            access: this.tchAuth.getTeacher().allCourseAccess
        }, {
            type: 'View',
            agentId: this.tchAuth.getTeacherId(),
            agentType: 'Teacher',
            agentName: this.tchAuth.getTeacherName(),
            tableName: 'Student ClassBook Page (ClassBook Get Method)',
            logSource: 'TMA',
            object: {
                studentId: this.studentId,
                studentName: this.student.name + ' ' + this.student.lastName,
                teacherId: this.tchAuth.getTeacherId(),
                page: this.page,
                sort: this.sort,
                courseName: this.courseName,
                className: this.className,
                HaveAccessToAll: this.tchAuth.getTeacher().allCourseAccess
            },
        }).subscribe(data => {
            if (data.success) {

                if (clear) {
                    this.studentClassBooks = [];
                }

                var classbooks: IClassBook[] = data.data.classBooks;

                classbooks.forEach(classBook => {
                    this.studentClassBooks.push(classBook);
                });

                this.totalCount = data.data.totalCount;
            } else {
                this.tchAuth.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.tchAuth.auth.handlerError(er);
        }, () => {
            this.isLoading = false;
        });
    }

    canShowMoreButton(): boolean {
        if (this.studentClassBooks.length < this.totalCount) {
            return true;
        }

        return false;
    }

    nextPage() {
        this.page += 1;

        this.refreshClassBooks();
    }

    delete(id, type) {
        if (window.confirm("آیا از حذف " + this.getClassBookTypeString(type) + " اطمینان دارید؟")) {
            this.tchAuth.auth.post("/api/ClassBook/Delete", [id], {
                type: 'Delete',
                agentId: this.tchAuth.getTeacherId(),
                agentType: 'Teacher',
                agentName: this.tchAuth.getTeacherName(),
                tableName: 'Remove ClassBook By Teacher, HaveAccessAll: ' + this.tchAuth.getTeacher().allCourseAccess,
                logSource: 'TMA',
                deleteObjects: [this.getClassBookTypeString(type) + ' ' + id],
            }).subscribe(data => {
                if (data.success) {
                    this.tchAuth.auth.message.showSuccessAlert("با موفقیت حذف شد");

                    this.refreshClassBooks(true);
                } else {
                    this.tchAuth.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.tchAuth.auth.handlerError(er);
            });

        }
    }

}
