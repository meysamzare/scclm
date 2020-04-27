import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { INotificationSeen } from '../../notification';
import { IGrade } from 'src/app/Dashboard/grade/grade';
import { IClass } from 'src/app/Dashboard/class/class';

@Component({
    selector: 'app-notification-seen-modal',
    templateUrl: './notification-seen-modal.component.html',
    styleUrls: ['./notification-seen-modal.component.scss']
})
export class NotificationSeenModalComponent implements OnInit {

    notificationSeens: INotificationSeen[] = [];

    search = "";


    grades: IGrade[] = [];
    selectedGrade: number = null;

    classesByGrade: IClass[] = [];
    selectedClass: number = null;

    constructor(
        public dialogRef: MatDialogRef<NotificationSeenModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService
    ) { }

    ngOnInit() {
        this.getAllGrades();

        this.refreshNotiSeens();
    }

    getAllGrades() {
        this.auth.post("/api/Grade/getAll").subscribe(data => {
            if (data.success) {
                this.grades = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    refreshNotiSeens() {

        var obj = {
            notificationId: this.data.id,
            gradeId: this.selectedGrade,
            classId:  this.selectedClass,
        }

        this.auth.post("/api/Notification/GetNotificationSeens", obj, {
            type: 'View',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'NotificationSeen',
            logSource: 'dashboard',
            object: obj,
            table: "Notification",
            tableObjectIds: [this.data.id]
        }).subscribe(data => {
            if (data.success) {
                this.notificationSeens = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    getFiltredNotificationSeens() {
        if (this.search) {
            return this.notificationSeens.filter(c => c.agentFullName.includes(this.search));
        }

        return this.notificationSeens;
    }


    onGradeSelected() {
        this.refreshNotiSeens();

        if (this.selectedGrade) {

            this.auth.post("/api/Class/getClassByGrade", this.selectedGrade).subscribe(data => {
                if (data.success) {
                    this.classesByGrade = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

        }
    }


    clearGradeAndClass() {
        this.selectedClass = null;
        this.selectedGrade = null;

        this.refreshNotiSeens();
    }
}
