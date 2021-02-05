import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
    templateUrl: './register-item-logins-modal.component.html',
    styleUrls: ['./register-item-logins-modal.component.scss']
})
export class RegisterItemLoginsModalComponent implements OnInit {

    Title = "";
    isLoading = false;
    catId = 0;
    catTitle = "";

    onlyShowAbsence = false;

    searchText = "";

    loginsList: {
        id: string,
        fullName: string,
        username: string,
        categoryAuthorizeState: string,
        userType: string,
        dateString: string,
        gradeId: number,
        classId: number,
        ip: string,
        absence: boolean
    }[] = [];

    constructor(
        public dialogRef: MatDialogRef<RegisterItemLoginsModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
    ) { }

    ngOnInit() {
        this.catId = this.data.catId;
        this.catTitle = this.data.catTitle;

        this.Title = `لیست ورود ها به ${this.catTitle}`;

        this.refreshLogins();
    }

    getNonAbsenceLoginCount() {
        return this.loginsList.filter(c => !c.absence).length;
    }

    refreshLogins() {
        this.isLoading = true;

        this.auth.post("/api/Category/getRegisterItemLogins", this.catId)
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
