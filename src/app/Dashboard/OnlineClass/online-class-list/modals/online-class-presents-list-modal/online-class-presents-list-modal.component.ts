import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { attendee, BigBlueButtonRepositoryService } from 'public/Services/big-blue-button/big-blue-button-repository.service';
import { IStudent } from 'src/app/Dashboard/student/student';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
    templateUrl: './online-class-presents-list-modal.component.html',
    styleUrls: ['./online-class-presents-list-modal.component.scss']
})
export class OnlineClassPresentsListModalComponent implements OnInit {

    Title = "";

    meetingId = "";

    className = "";

    isLoading = false;

    onlyShowAbsence = false;
    searchText = "";

    allowedStudentIds: number[] = [];

    onlineClassLogins: attendee[] = [];

    students: IStudent[] = [];

    constructor(
        public dialogRef: MatDialogRef<OnlineClassPresentsListModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
        private bbbRepo: BigBlueButtonRepositoryService
    ) { }

    ngOnInit() {
        this.className = this.data.className;
        this.meetingId = this.data.meetingId;

        this.Title = `لیست حاضرین در ${this.className}`;

        this.refreshLogins();


        this.auth.logToServer({
            type: 'View',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: "View Present and Absence From Dashboard For Class: " + this.className,
            logSource: 'dashboard',
            object: { meetingId: this.meetingId, className: this.className },
            oldObject: null,
            table: "OnlineClass",
            tableObjectIds: [this.meetingId]
        });
    }

    async refreshLogins() {
        this.isLoading = true;
        try {

            const studentsResult = await this.auth.post("/api/Student/getAll").toPromise();

            this.students = studentsResult.data;

            this.allowedStudentIds = await this.bbbRepo._getOnlineClassAllowedStudentIds(this.meetingId);

            this.students = this.students.filter(c => this.allowedStudentIds.includes(c.id));

            const meetingInfo = await this.bbbRepo.getMeetingInfo(this.meetingId);

            this.onlineClassLogins = this.bbbRepo.getAttendeeArray(meetingInfo.attendees);

            this.onlineClassLogins = this.onlineClassLogins.filter(c => c.userID.startsWith("St"));

            this.onlineClassLogins.forEach(studentLogin => {
                const stdId = Number.parseInt(studentLogin.userID.split("_")[1]);

                this.onlineClassLogins.find(c => c == studentLogin)["stdId"] = stdId;
            });

        } catch { }

        this.isLoading = false;
    }

    getNonAbsenceLoginCount() {
        return this.students.filter(c => this.isStudentPresent(c.id)).length;
    }

    isStudentPresent(stdId): boolean {
        const stdLogin = this.onlineClassLogins.find(c => c["stdId"] == stdId);

        if (stdLogin) {
            return true;
        }

        return false;
    }

    getStudentState(stdId): attendee {
        const stdLogin = this.onlineClassLogins.find(c => c["stdId"] == stdId);

        if (stdLogin) {
            const obj = stdLogin;

            const keys = Object.keys(obj);
            const values = Object.values(obj);
            
            keys.forEach((key, index) => {
                if (key.startsWith("is") || key.startsWith("has")) {
                    obj[key] = JSON.parse(values[index] as string);
                }
            });

            return obj;
        }

        return null;
    }

    getFilteredLogins(): any[] {
        const filterText = this.searchText;
        let students = this.students;

        if (this.onlyShowAbsence) {
            students = students.filter(c => !this.isStudentPresent(c.id));
        }

        if (!filterText) {
            return students;
        }

        return students.filter(c =>
            c.name.includes(filterText));
    }

}
