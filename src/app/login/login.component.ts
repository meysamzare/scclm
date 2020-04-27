import { Component, ViewChild } from "@angular/core";
import { ReCaptchaV3Service, InvisibleReCaptchaComponent } from "ngx-captcha";
import { Router } from "@angular/router";
import { AuthService, jsondata } from "../shared/Auth/auth.service";
import { NgForm } from "@angular/forms";
import { ICategory } from "../Dashboard/category/category";
import { MessageService } from "../shared/services/message.service";

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
			if (this.auth.showRecaptcha) {
				if (this.captchaElem.success) {
					return this.auth.Login(this.user.username, this.user.password, {
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
				}
			}

			return this.auth.Login(this.user.username, this.user.password, {
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
		}
	}
	back() {
		location.replace(this.auth.indexUrl);
	}
}
