import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
    selector: 'app-teacher-change-password-modal',
    templateUrl: './teacher-change-password-modal.component.html',
    styleUrls: ['./teacher-change-password-modal.component.scss']
})
export class TeacherChangePasswordModalComponent implements OnInit {

    teacherId = 0;

    Password = "";

    constructor(
        public dialogRef: MatDialogRef<TeacherChangePasswordModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
        private message: MessageService
    ) { }

    ngOnInit() {
        this.teacherId = this.data.id;
    }


    isPasswordLengthTrue() {
        return (this.Password.length <= 16 && this.Password.length != 0);
    }

    sts() {
        this.auth.post("/api/Teacher/ChangeTeacherPassword", {
            id: this.teacherId,
            newPass: this.Password
        }, {
            type: 'Edit',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Teacher Change Password Dialog',
            logSource: 'dashboard',
            object: {
                id: this.teacherId,
                newPass: this.Password
            },
            oldObject: {
                id: this.teacherId,
                oldPass: "Unknown"
            },
            table: "Teacher",
            tableObjectIds: [this.teacherId]
        }).subscribe(data => {
            if (data.success) {
                this.dialogRef.close();

                this.message.showSuccessAlert();
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }



}
