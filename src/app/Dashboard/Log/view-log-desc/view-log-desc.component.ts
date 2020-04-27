import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
    selector: 'app-view-log-desc',
    templateUrl: './view-log-desc.component.html',
    styleUrls: ['./view-log-desc.component.scss']
})
export class ViewLogDescComponent implements OnInit {

    id = "";
    date = "";
    desc = "";

    isLoading = true;

    constructor(
        public dialogRef: MatDialogRef<ViewLogDescComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
        private message: MessageService
    ) { }

    ngOnInit() {
        this.id = this.data.id;
        this.date = this.data.date;

        this.auth.post("/api/Log/getDesc", {
            id: this.id,
            date: this.date
        }).subscribe(data => {
            if (data.success) {
                this.desc = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        }, () => {
            this.isLoading = false;
        });
    }

}
