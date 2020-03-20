import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { RegisterItemLoginService } from './register-item-login.service';

@Component({
    selector: 'app-login-for-register-item',
    templateUrl: './login-for-register-item.component.html',
    styleUrls: ['./login-for-register-item.component.scss']
})
export class LoginForRegisterItemComponent implements OnInit {

    catId: number;

    username: string = "";
    password: string = "";

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        public auth: AuthService,
        private loginService: RegisterItemLoginService
    ) {
        this.activeRoute.params.subscribe(params => {
            this.catId = params["id"];
        });
    }

    ngOnInit() {
    }

    sts() {
        this.auth.post("/api/Item/LoginForRegisterCat", {
            username: this.username,
            password: this.password,
            catId: this.catId
        }).subscribe(data => {
            if (data.success) {
                if (!data.data) {
                    return this.auth.message.showErrorAlert("در هنگام ورود خطایی رخ داده است");
                }

                var date = new Date();
                date = new Date(date.setMinutes(30));

                var jwt = data.data.jwt;
                var userType = data.data.userType;
                var userFullname = data.data.userFullname;
                
                this.loginService.addToken({
                    categoryId: this.catId,
                    dateExpire: date,
                    jwtToken: jwt,
                    username: this.username,
                    userFullName: userFullname,
                    userType: userType
                });

                this.router.navigate([`/register-item/${this.catId}`]);
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

}
