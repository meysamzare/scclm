import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FastEditStudentModalComponent } from '../fast-edit/fast-edit.component';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
    selector: 'app-change-std-password',
    templateUrl: './change-std-password.component.html',
    styleUrls: ['./change-std-password.component.scss']
})
export class ChangeStdPasswordComponent implements OnInit {

    stdId = 0;
    type = 1;
    stdName = "";

    Password = "";

    constructor(
        public dialogRef: MatDialogRef<FastEditStudentModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
        private message: MessageService
    ) { }

    ngOnInit() {
        this.stdId = this.data.stdId;
        this.type = this.data.type;
        this.stdName = this.data.stdName;
    }

    isPasswordLengthTrue() {
        return (this.Password.length <= 16 && this.Password.length != 0);
    }

    sts() {
        if (this.isPasswordLengthTrue()) {
            // Type 1 = Student
            // Type 2 = StudentParent
            this.auth.post("/api/Student/ChangePasswordByType", {
                stdId: this.stdId,
                type: this.type,
                password: this.Password
            }, {
                type: 'Edit',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Chage Student(Type = 1)/StudentParent(Type = 2) Password',
                logSource: 'dashboard',
                object: {
                    stdId: this.stdId,
                    type: this.type,
                    password: this.Password
                },
                oldObject: {
                    stdId: this.stdId,
                    type: this.type,
                    password: this.Password
                },
                table: "Student",
                tableObjectIds: [this.stdId]
            }).subscribe(data => {
                if (data.success) {
                    this.message.showSuccessAlert();
                    this.dialogRef.close();
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

        }
    }



}
