import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { IClass } from "src/app/Dashboard/class/class";
import { IGrade } from "src/app/Dashboard/grade/grade";
import { IYeareducation } from "src/app/Dashboard/yeareducation/yeareducation";
import { ITitute } from "src/app/Dashboard/titute/titute";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { StdClassMng } from "../../stdClassMng";
import { IStudentType } from "../../StudentType/student-type";


@Component({
    templateUrl: "./register-student.component.html"
})
export class RegisterStudentModalComponent implements OnInit {


    titutes: ITitute[] = [];
    yeareducations: IYeareducation[] = [];
    grades: IGrade[] = [];
    classes: IClass[] = [];

    studentTypes: IStudentType[] = [];

    stdClassMng: StdClassMng = new StdClassMng();

    constructor(
        public dialogRef: MatDialogRef<RegisterStudentModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
        private message: MessageService
    ) { }

    ngOnInit(): void {
        this.stdClassMng.studentId = this.data.stdId;

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
        this.auth.post("/api/StudentType/getAll", null).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.studentTypes = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
    }

    registerStudent() {
        if (!this.data.registerGroup) {
            this.auth.post("/api/StdClassMng/Add", this.stdClassMng, {
                type: 'Add',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'StdClassMng(RegisterStudentModal)',
                logSource: 'dashboard',
                object: this.stdClassMng,
                table: "StdClassMng",
                tableObjectIds: [this.stdClassMng.studentId]
            }).subscribe((data: jsondata) => {
                if (data.success) {
                    this.message.showSuccessAlert("با موفقیت ثبت شد");
                    this.dialogRef.close(true);
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            });
        } else {
            this.auth.post("/api/StdClassMng/AddGroup", {
                stdClassMng: this.stdClassMng,
                ids: this.data.ids
            }, {
                type: 'Add',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'StdClassMng(Add StdClassMng Group)',
                logSource: 'dashboard',
                object: {
                    stdClassMng: this.stdClassMng,
                    StudentsIds: this.data.ids
                },
                table: "StdClassMng",
                tableObjectIds: this.data.ids
            }).subscribe((data: jsondata) => {
                if (data.success) {
                    this.message.showSuccessAlert("موارد انتخابی با موفقیت ثبت شدند");
                    this.dialogRef.close(true);
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            });
        }
    }

    getDisableButtonState() {
        var std = this.stdClassMng;

        if (std.classId == null || std.gradeId == null || std.insTituteId == null || std.yeareducationId == null) {
            return true;
        }

        return false;
    }

    getClassesByGrade(gradeid) {
        if (gradeid) {
            this.auth.post("/api/Class/getClassByGrade", gradeid).subscribe((data: jsondata) => {
                if (data.success) {
                    this.stdClassMng.classId = null;
                    this.classes = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            });
        }
    }
}