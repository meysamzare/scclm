import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/shared/services/message.service';
import { ThemeService } from 'projects/ParentsMobileApp/src/app/service/theme.service';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { Router } from '@angular/router';
import { TeacherAuthService } from '../../../services/teacher-auth.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
    nowPassword = "";
    newPassword = "";
    reNewPassword = "";

    constructor(
        private message: MessageService,
        private theme: ThemeService,
        private tchAuth: TeacherAuthService,
        private auth: AuthService,
        private router: Router
    ) { }

    ngOnInit() { }

    isReNewPassTrue(): boolean {
        return this.newPassword == this.reNewPassword;
    }

    sts() {
        if (this.isReNewPassTrue()) {
            this.auth.post("/api/Teacher/ChangePassword", {
                nowPass: this.nowPassword,
                newPass: this.newPassword,
                id: this.tchAuth.getTeacherId()
            }, {
                type: 'Edit',
                agentId: this.tchAuth.getTeacherId(),
                agentType: 'Teacher',
                agentName: this.tchAuth.getTeacherName(),
                tableName: 'Change Password',
                logSource: 'TMA',
                object: {
                    nowPass: this.nowPassword,
                    newPass: this.newPassword,
                    id: this.tchAuth.getTeacherId()
                },
                oldObject: null
            }).subscribe(data => {
                if (data.success) {
                    this.message.showSuccessAlert();

                    var tch = this.tchAuth.getTeacher() as any;

                    tch.password = this.newPassword;

                    this.tchAuth.setTeacher(tch);

                    this.router.navigate(["../"]);
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }
    }

}
