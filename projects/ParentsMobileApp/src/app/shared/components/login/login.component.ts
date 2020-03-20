import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../service/theme.service';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { StudentAuthService } from '../../../service/parent-student-auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { Router } from '@angular/router';
import { IStudent } from 'src/app/Dashboard/student/student';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    username = "";
    password = "";

    isLoading = false;

    constructor(
        private theme: ThemeService,
        private auth: AuthService,
        private studentAuth: StudentAuthService,
        private message: MessageService,
        private router: Router
    ) {
        this.theme.setThemeColor("default", false);
    }

    ngOnInit() { }

    sts() {
        this.isLoading = true;
        this.auth.post("/api/Student/LoginParent", {
            username: this.username,
            password: this.password
        }, {
            type: 'View',
            agentId: 0,
            agentType: 'StudentParent',
            agentName: this.username,
            tableName: 'Login To PMA App',
            logSource: 'PMA',
            object: {
                username: this.username,
                password: this.password
            },
        }).subscribe(data => {
            if (data.success) {

                var isUserHaveToChangePass: boolean = data.data.changePass;

                var student: IStudent = data.data.std;

                (student as any).stdClassMngs = data.data.stdClassMngs;

                this.studentAuth.setStudent(student);

                if (this.studentAuth.getActiveStdClassMng() == null) {
                    return this.auth.message.showErrorAlert("خطایی در ورود شما رخ داده است لطفا با معاونت آموزشی تماس حاصل فرمایید");
                }

                this.auth.setToken(data.data.token);

                this.studentAuth.isUserHaveToChangePass = isUserHaveToChangePass;


                this.router.navigateByUrl("/");


            } else {
                this.message.showMessageforFalseResult(data);
                this.isLoading = false;

            }
        }, er => {
            this.auth.handlerError(er);
            this.isLoading = false;

        });

    }

}