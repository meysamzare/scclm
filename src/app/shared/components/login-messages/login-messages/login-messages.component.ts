import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { INotification } from 'src/app/Dashboard/notification/notification';

@Component({
    selector: 'app-login-messages',
    templateUrl: './login-messages.component.html',
    styleUrls: ['./login-messages.component.scss']
})
export class LoginMessagesComponent implements OnInit {

    @Input() public Type: 3 | 4 | 5 | 6 = 3;

    notifications: INotification[] = [];

    constructor(
        private auth: AuthService
    ) { }

    ngOnInit() {
        this.auth.post("/api/Notification/getLoginNotification", this.Type).subscribe(data => {
            if (data.success) {
                this.notifications = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    getColorByType(type): string {
        if (type == 0) {
            return "black";
        }
        if (type == 1) {
            return "green";
        }
        if (type == 2) {
            return "orange";
        }
        if (type == 3) {
            return "red";
        }

        return "unset";
    }

}
