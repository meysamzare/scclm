import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";
import { IStudent } from "../../student";
import { NgForm } from "@angular/forms";



@Component({
    templateUrl: "./fast-edit.component.html"
})
export class FastEditStudentModalComponent implements OnInit {
    
    student: IStudent = new IStudent();

    oldData = null;

    @ViewChild("fm1", {static: false}) public fm1: NgForm;
    
    constructor(
        public dialogRef: MatDialogRef<FastEditStudentModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
        private message: MessageService
    ) { }

    openc(picker) {
        picker.open();
    }

    ngOnInit(): void {
        this.student = this.data.student;

        this.oldData = JSON.stringify(this.data.student);
    }

    sts() {
        if (this.fm1.valid) {
            this.auth.post("/api/Student/EditF", this.student, {
                type: 'Edit',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Student(Fast Edit)',
                logSource: 'dashboard',
                object: this.student,
                oldObject: JSON.parse(this.oldData)
            }).subscribe((data: jsondata) => {
                if (data.success) {
                    this.message.showSuccessAlert("با موفقیت ثبت شد");
                    this.dialogRef.close(true);
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            });
        }
    }
}