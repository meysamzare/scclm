import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/shared/services/message.service';
import { ThemeService } from '../../../service/theme.service';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { Router } from '@angular/router';
import { StudentAuthService } from '../../../service/parent-student-auth.service';

@Component({
    selector: 'app-chanage-password',
    templateUrl: './chanage-password.component.html',
    styleUrls: ['./chanage-password.component.scss']
})
export class ChanagePasswordComponent implements OnInit {

    nowPassword = "";
    newPassword = "";
    reNewPassword = "";

    constructor(
        private message: MessageService,
        private theme: ThemeService,
        private stdAuth: StudentAuthService,
        private auth: AuthService,
        private router: Router
    ) { }

    ngOnInit() { }

    isReNewPassTrue(): boolean {
        return this.newPassword == this.reNewPassword;
    }

    sts() {
        if (this.isReNewPassTrue()) {
            this.auth.post("/api/Student/ChangeParentPassword", {
                nowPass: this.nowPassword,
                newPass: this.newPassword,
                id: this.stdAuth.getStudent().id
            }, {
                type: 'Edit',
                agentId: this.stdAuth.getStudent().id,
                agentType: 'StudentParent',
                agentName: this.stdAuth.getStudentFullName(),
                tableName: 'ChangeParentPassword',
                logSource: 'PMA',
                object: {
                    nowPass: this.nowPassword,
                    newPass: this.newPassword,
                    id: this.stdAuth.getStudent().id
                },
                oldObject: null
            }).subscribe(data => {
                if (data.success) {
                    this.message.showSuccessAlert();

                    var student = this.stdAuth.getStudent() as any;

                    student.parentsPassword = this.newPassword;

                    this.stdAuth.setStudent(student);

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
