import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
    templateUrl: './online-class-logins-modal.component.html',
    styleUrls: ['./online-class-logins-modal.component.scss']
})
export class OnlineClassLoginsModalComponent implements OnInit {

    Title = "";
    isLoading = false;
    meetingId = 0;
    onlineClassTitle = "";

    onlyShowAbsence = false;

    searchText = "";

    loginsList: {
        id: string,
        fullName: string,
        username: string,
        onlineClassAgentTypeString: string,
        dateString: string,
        ip: string,
        absence: boolean
    }[] = [];

    constructor(
        public dialogRef: MatDialogRef<OnlineClassLoginsModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
    ) { }

    ngOnInit() {
        this.meetingId = this.data.meetingId;
        this.onlineClassTitle = this.data.className;

        this.Title = `لیست ورود به ${this.onlineClassTitle}`;

        this.refreshLogins();
    }

    getNonAbsenceLoginCount() {
        return this.loginsList.filter(c => !c.absence).length;
    }

    refreshLogins() {
        this.isLoading = true;

        this.auth.post("/api/OnlineClass/getLogins", this.meetingId)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(data => {
            if (data.success) {
                this.loginsList = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    getFiltredLogins() {
        const filterText = this.searchText;
        let logins = this.loginsList;

        if (this.onlyShowAbsence) {
            logins = logins.filter(c => c.absence == this.onlyShowAbsence)
        }

        if (!filterText) {
            return logins;
        }

        return logins.filter(c => 
            c.fullName.includes(filterText) || 
            c.ip.includes(filterText) || 
            c.username.includes(filterText) || 
            c.dateString.includes(filterText));
    }
}
