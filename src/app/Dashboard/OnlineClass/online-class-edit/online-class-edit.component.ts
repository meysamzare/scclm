import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { IOnlineClass } from '../online-class';
import { IGrade } from '../../grade/grade';
import { IClass } from '../../class/class';
import { ICourse } from '../../course/course';
import { IOnlineClassServer } from '../../OnlineClassServer/online-class-server';
import { ITeacher } from '../../teacher/teacher';
import { MatDialog } from '@angular/material';
import { SelectStudentForOnlineClassAccessModalComponent } from './modals/select-student-for-online-class-access-modal/select-student-for-online-class-access-modal.component';

@Component({
    selector: 'app-online-class-edit',
    templateUrl: './online-class-edit.component.html',
    styleUrls: ['./online-class-edit.component.scss']
})
export class OnlineClassEditComponent implements OnInit {
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    PAGE_Data: IOnlineClass;

    oldData = null;

    PAGE_TITLE = " کلاس مجازی ";
    PAGE_TITLES = " کلاس های مجازی ";
    PAGE_APIURL = "OnlineClass";
    PAGE_URL = "online-class";

    @ViewChild("fm1", { static: false }) public fm1: NgForm;

    grades: IGrade[] = [];
    classes: IClass[] = [];
    courses: ICourse[] = [];
    onlineClassServers: IOnlineClassServer[] = [];


    Teachers: ITeacher[] = [];
    selectedTeacherId = null;

    Students: any[] = [];
    
    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        public auth: AuthService,
        private dialog: MatDialog
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.PAGE_Data = data.onlineClass;

                if (!this.PAGE_Data.allowedAdminIds) {
                    this.PAGE_Data.allowedAdminIds = [];
                }

                if (!this.PAGE_Data.allowedStudentIds) {
                    this.PAGE_Data.allowedStudentIds = [];
                }

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


            this.auth.post("/api/Grade/getAll").subscribe(data => {
                if (data.success) {
                    this.grades = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

            this.auth.post("/api/Class/getAll").subscribe(data => {
                if (data.success) {
                    this.classes = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

            this.auth.post("/api/Course/getAll").subscribe(data => {
                if (data.success) {
                    this.courses = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });


            this.auth.post("/api/Teacher/getAll").subscribe(data => {
                if (data.success) {
                    this.Teachers = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            });

            this.auth.post("/api/Student/getAll").subscribe(data => {
                if (data.success) {
                    this.Students = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            });

            this.auth.post("/api/OnlineClassServer/getAll").subscribe(data => {
                if (data.success) {
                    this.onlineClassServers = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
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

    getClassByGrade() {
        let selectedGrade = this.PAGE_Data.gradeId;

        if (selectedGrade) {
            return this.classes.filter(c => c.gradeId == selectedGrade);
        }

        return [];
    }

    getCourseByGrade() {
        let selectedGrade = this.PAGE_Data.gradeId;

        if (selectedGrade) {
            return this.courses.filter(c => c.gradeId == selectedGrade);
        }

        return [];
    }


    randomString(filelength = 10): string {
        let result = "";
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < filelength; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
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

                this.PAGE_Data.meetingId = `syco_${this.randomString(20)}`;
                this.PAGE_Data.attendeePW = this.randomString();
                this.PAGE_Data.moderatorPW = this.randomString();

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

    addTeacherToOnlineClassAccess() {
        if (this.selectedTeacherId) {
            const exist = this.PAGE_Data.allowedAdminIds.find(c => c == this.selectedTeacherId);

            if (!exist) {
                this.PAGE_Data.allowedAdminIds.push(this.selectedTeacherId);
                this.selectedTeacherId = null;
            } else {
                this.selectedTeacherId = null;
            }
        }
    }

    getTeacherName(teacherId) {
        let teacher = this.Teachers.find(c => c.id == teacherId);

        if (teacher) {
            return teacher.name;
        }

        return "";
    }

    removeTeacher(teacherId) {
        let exist = this.PAGE_Data.allowedAdminIds.find(c => c == teacherId);

        if (exist) {
            this.PAGE_Data.allowedAdminIds.splice(this.PAGE_Data.allowedAdminIds.indexOf(exist), 1);
        }
    }

    openSelectStudentDialog() {
        this.dialog.open(SelectStudentForOnlineClassAccessModalComponent).afterClosed().subscribe(result => {
            if (result) {
                const selectedStudentIds: number[] = result;
                const allowedStudentIds = this.PAGE_Data.allowedStudentIds;
                selectedStudentIds.forEach(stdId => {
                    if (!allowedStudentIds.some(c => c == stdId)) {
                        this.PAGE_Data.allowedStudentIds.push(stdId);
                    }
                });
            }
        });
    }

    removeStudent(studentId) {
        let exist = this.PAGE_Data.allowedStudentIds.find(c => c == studentId);

        if (exist) {
            this.PAGE_Data.allowedStudentIds.splice(this.PAGE_Data.allowedStudentIds.indexOf(exist), 1);
        }
    }

    
    getStudentName(studentId) {
        let student = this.Students.find(c => c.id == studentId);

        if (student) {
            return student.name;
        }

        return "";
    }
}
