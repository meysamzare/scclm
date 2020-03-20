import { Component, OnInit } from '@angular/core';
import { TeacherAuthService } from '../../../services/teacher-auth.service';

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
        private tchAuth: TeacherAuthService
    ) { }

    ngOnInit() { }

    sts() {
        this.isLoading = true;
        this.tchAuth.auth.post("/api/Teacher/Login", {
            username: this.username,
            password: this.password
        }, {
            type: 'View',
            agentId: 0,
            agentType: 'Teacher',
            agentName: this.username,
            tableName: 'Login To TMA',
            logSource: 'TMA',
            object: {
                username: this.username,
                password: this.password
            },
        }).subscribe(data => {
            if (data.success) {
                this.tchAuth.auth.setToken(data.data.tk);

                this.tchAuth.setTeacher(data.data.teacher);

                this.tchAuth.auth.message.showSuccessAlert("با موفقیت وارد شدید");

                this.tchAuth.router.navigateByUrl("/");
            } else {
                this.tchAuth.auth.message.showMessageforFalseResult(data);
                this.isLoading = false;

            }
        }, er => {
            this.tchAuth.auth.handlerError(er);
            this.isLoading = false;
        });
    }

}
