import { Component, ViewChild } from "@angular/core";
import { ReCaptchaV3Service, InvisibleReCaptchaComponent } from "ngx-captcha";
import { Router } from "@angular/router";
import { AuthService, jsondata } from "../shared/Auth/auth.service";
import { NgForm } from "@angular/forms";
import { ICategory } from "../Dashboard/category/category";
import { MessageService } from "../shared/services/message.service";
import { finalize } from "rxjs/operators";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html"
})
export class LoginComponent {
    siteKey = "";

    user = {
        username: "",
        password: ""
    };


    categorys: ICategory[] = [];

    isLoading = false;

    @ViewChild("fm1", { static: false }) public fm1: NgForm;
    @ViewChild("captchaElem", { static: false }) public captchaElem: InvisibleReCaptchaComponent;

    constructor(
        private reCaptchaV3Service: ReCaptchaV3Service,
        private router: Router,
        public message: MessageService,
        public auth: AuthService
    ) {
        // this.reCaptchaV3Service.execute(this.siteKey, 'homepage', (token) => {
        //     console.log('This is your token: ', token);
        // });
    }

    Login() {
        if (this.fm1.valid) {

            this.isLoading = true;

            if (this.auth.showRecaptcha) {
                if (this.captchaElem.success) {
                    this.doLogin();
                    return;
                }
            }

            this.doLogin();
        }
    }

    doLogin() {

        this.isLoading = true;

        let req = this.auth.post("/api/User/Login", {
            username: this.user.username,
            password: this.user.password
        }, {
            type: 'View',
            agentId: 0,
            agentType: 'User',
            agentName: this.user.username,
            tableName: 'Login To dashboard App',
            logSource: 'dashboard',
            object: {
                username: this.user.username,
                password: this.user.password
            },
            table: "User"
        });

        req.pipe(finalize(() => this.isLoading = false)).subscribe(data => {
            if (data.success) {
                this.message.showSuccessAlert("با موفقیت وارد شدید");

                this.auth.setUser(data.data);
                this.auth.setUserRole(data.data.role);
                this.auth.setToken(data.redirect);

                this.auth.clearLockUserState();

                if (this.auth.redirectUrl) {
                    // location.href = "/#" + this.redirectUrl;
                    this.router.navigateByUrl(this.auth.redirectUrl);
                } else {
                    // location.href = "/#" + "/dashboard";
                    this.router.navigateByUrl(`/dashboard`);
                }


                // location.reload();
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

        return req;
    }

    back() {
        location.replace(this.auth.indexUrl);
    }
}
