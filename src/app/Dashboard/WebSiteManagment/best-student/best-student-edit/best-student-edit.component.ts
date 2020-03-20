import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IBestStudent } from '../best-student';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { IStudent } from 'src/app/Dashboard/student/student';
import { StdClassMng } from 'src/app/Dashboard/student/stdClassMng';

@Component({
    selector: 'app-best-student-edit',
    templateUrl: './best-student-edit.component.html',
    styleUrls: ['./best-student-edit.component.scss']
})
export class BestStudentEditComponent implements OnInit, OnDestroy {

    Title: string;
    btnTitle: string;
    isEdit: boolean = false;

    PAGE_Data: IBestStudent;

    oldData = null;

    PAGE_TITLE = " دانش آموز برتر ";
    PAGE_TITLES = " دانش آموزان برتر ";
    PAGE_APIURL = "BestStudent";
    PAGE_URL = "best-student";

    students: IStudent[] = [];
    selectedStudent: number = null;

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
                this.PAGE_Data = data.bestStudent;

                if (!this.PAGE_Data.picData) {
                    this.PAGE_Data.picData = "";
                }

                this.oldData = JSON.stringify(data.bestStudent);
            });

            var id = params["id"];

            if (id === "0") {
                this.Title = "افزودن " + this.PAGE_TITLE;
                this.btnTitle = "افزودن";
                this.isEdit = false;

                this.auth.post("/api/Student/getAll").subscribe(data => {
                    if (data.success) {
                        this.students = data.data;
                    } else {
                        this.auth.message.showMessageforFalseResult(data);
                    }
                }, er => {
                    this.auth.handlerError(er);
                });

            } else {
                var idd = Number.parseInt(id);
                if (Number.isInteger(idd)) {
                    this.Title = "ویرایش " + this.PAGE_TITLE + this.PAGE_Data.fullName;
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
        let title = this.PAGE_APIURL;
        if (!this.fm1.submitted) {
            if (this.fm1.dirty) {
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

                this.PAGE_Data.picData = result;
                this.PAGE_Data.picName = file.name;
            };
        });
    }

    removePic() {
        this.d1.reset();
        this.PAGE_Data.picData = "";
        this.PAGE_Data.picName = "";
    }

    openc(obj) {
        obj.open();
    }

    onStudentSelect() {
        if (this.selectedStudent) {
            var student = this.students.find(c => c.id == this.selectedStudent);
            this.PAGE_Data.fullName = student.name;

            this.auth.post("/api/StdClassMng/getAllbyStd", student.id).subscribe(data => {
                if (data.success) {
                    var stdClassMngs: StdClassMng[] = data.data;

                    if (stdClassMngs.length != 0) {
                        let haveActive = false;
                        let active: StdClassMng = null;
                        stdClassMngs.forEach(stdclassmng => {
                            if (stdclassmng.isActive) {
                                haveActive = true;

                                active = stdclassmng;
                            }
                        });

                        if (!haveActive) {
                            active = stdClassMngs[0];
                        }

                        this.PAGE_Data.class = `${active.gradeName} | ${active.className}`
                    }
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
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
                    tableName: 'BestStudent',
                    logSource: 'dashboard',
                    object: this.PAGE_Data,
                    oldObject: JSON.parse(this.oldData)
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
                    tableName: 'BestStudent',
                    logSource: 'dashboard',
                    object: this.PAGE_Data,
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

    ngOnInit() { }

}
