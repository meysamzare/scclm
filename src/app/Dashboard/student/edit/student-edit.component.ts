import { Component, ViewChild, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { IStudent } from "../student";
import { IStudentInfo } from "../studentinfo";

@Component({
    templateUrl: "./student-edit.component.html"
})
export class StudentEditComponent implements OnDestroy{
    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    student: IStudent;
    studentInfo: IStudentInfo = new IStudentInfo();

    oldData = null;

    @ViewChild("fm1", { static: false }) public fm1: NgForm;
    @ViewChild("d1", { static: false }) public d1;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        public auth: AuthService
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.student = data.std.student;
                if (data.std.studentinfo) {
                    this.studentInfo = data.std.studentinfo;
                }

                if (!this.student.picData) {
                    this.student.picData = "";
                }

                this.oldData = JSON.stringify({
                    student: this.student,
                    studentInfo: this.studentInfo
                });
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "تعریف دانش آموز";
                this.btnTitle = "افزودن";
                this.isEdit = false;
            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title =
                        "ویرایش دانش آموز " +
                        this.student.name +
                        " " +
                        this.student.lastName;

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
        let title = "student";
        if (!this.fm1.submitted) {
            if (this.fm1.dirty && !this.isEdit) {
                this.auth.draft.setDraft({
                    title: title,
                    value: JSON.stringify({
                        student: this.student,
                        studentinfo: this.studentInfo
                    })
                });
            }
        } else {
            if (!this.isEdit) {
                this.auth.draft.removeDraft(title)
            }
        }
    }

    openc(picker) {
        picker.open();
    }


    setPic(files: File[]) {

        files.forEach(file => {
            if (file.size / 1024 / 1024 > 2) {
                this.d1.reset();
                return this.message.showWarningAlert(
                    "حجم فایل باید کمتر از " + " دو مگابایت " + " باشد",
                    "اخطار"
                );
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e: ProgressEvent) => {
                let result = reader.result.toString().split(",")[1];

                this.student.picData = result;
                this.student.picName = file.name;
            };
        });
    }

    removePic() {
        this.d1.reset();
        this.student.picData = "";
        this.student.picName = "";
    }

    sts() {
        if (this.fm1.valid) {
            if (this.isEdit) {
                this.auth
                    .post("/api/Student/Edit", {
                        student: this.student,
                        studentInfo: this.studentInfo
                    }, {
                        type: 'Edit',
                        agentId: this.auth.getUserId(),
                        agentType: 'User',
                        agentName: this.auth.getUser().fullName,
                        tableName: 'Student',
                        logSource: 'dashboard',
                        object: {
                            student: this.student,
                            studentInfo: this.studentInfo
                        },
                        oldObject: JSON.parse(this.oldData)
                    })
                    .subscribe(
                        (data: jsondata) => {
                            if (data.success) {
                                this.message.showSuccessAlert(
                                    "با موفقیت ثبت شد"
                                );

                                this.route.navigate(["/dashboard/student"]);
                            } else {
                                this.message.showMessageforFalseResult(data);
                            }
                        },
                        er => {
                            this.auth.handlerError(er);
                        }
                    );
            } else {
                this.auth
                    .post("/api/Student/Add", {
                        student: this.student,
                        studentInfo: this.studentInfo
                    }, {
                        type: 'Add',
                        agentId: this.auth.getUserId(),
                        agentType: 'User',
                        agentName: this.auth.getUser().fullName,
                        tableName: 'Student',
                        logSource: 'dashboard',
                        object: {
                            student: this.student,
                            studentInfo: this.studentInfo
                        },
                    })
                    .subscribe(
                        (data: jsondata) => {
                            if (data.success) {
                                this.message.showSuccessAlert(
                                    "با موفقیت ثبت شد"
                                );

                                this.route.navigate(["/dashboard/student"]);
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
