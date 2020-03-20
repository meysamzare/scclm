import { Component, OnInit } from '@angular/core';
import { ITeacher } from 'src/app/Dashboard/teacher/teacher';
import { StudentAuthService } from '../../../service/parent-student-auth.service';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-select-chat-reciver-dialog',
    templateUrl: './select-chat-reciver-dialog.component.html',
    styleUrls: ['./select-chat-reciver-dialog.component.scss']
})
export class SelectChatReciverDialogComponent implements OnInit {

    teachers: ITeacher[] = [];

    isLoading = true;

    constructor(
        private stdAuth: StudentAuthService,
        public dialogRef: MatDialogRef<SelectChatReciverDialogComponent>,
    ) { }

    ngOnInit() {
        this.isLoading = true;
        this.stdAuth.auth.post("/api/Teacher/getAll").subscribe(data => {
            if (data.success) {
                this.teachers = data.data;
            } else {
                this.stdAuth.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.stdAuth.auth.handlerError(er);
        }, () => {
            this.isLoading = false;
        });
    }

    onReciverSelected(id, name, type) {
        this.dialogRef.close({
            id: id,
            name: name,
            type: type
        });
    }

}
