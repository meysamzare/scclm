import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ReCaptchaV3Service, InvisibleReCaptchaComponent } from "ngx-captcha";
import { Router } from "@angular/router";
import { MessageService } from "../shared/services/message.service";
import { AuthService, jsondata } from "../shared/Auth/auth.service";


@Component({
	templateUrl: "./login-student.component.html"
})
export class LoginStudentComponent {
	username = "";
	password = "";

	@ViewChild("fm1", { static: false }) public fm1: NgForm;
	@ViewChild("captchaElem", { static: false }) public captchaElem: InvisibleReCaptchaComponent;

	constructor(
		private reCaptchaV3Service: ReCaptchaV3Service,
		private router: Router,
		private message: MessageService,
		public auth: AuthService
	) { }

	Login() {
		if (this.fm1.valid) {
			if (this.auth.showRecaptcha) {
				if (this.captchaElem.success) {
					return this.auth.post("/api/Student/loginStudent", {
						username: this.username,
						password: this.password
					}).subscribe((data: jsondata) => {
						if (data.success) {
							this.message.showSuccessAlert("با موفقیت وارد شدید");

							localStorage.setItem("tsk", data.data.tk)

							this.router.navigate(["/student-workbook/" + data.data.id], { skipLocationChange: true });
						} else {
							this.message.showMessageforFalseResult(data);
						}
					});
				}
			}

			return this.auth.post("/api/Student/loginStudent", {
				username: this.username,
				password: this.password
			}).subscribe((data: jsondata) => {
				if (data.success) {
					this.message.showSuccessAlert("با موفقیت وارد شدید");

					localStorage.setItem("tsk", data.data.tk)

					this.router.navigate(["/student-workbook/" + data.data.id], { skipLocationChange: true });
				} else {
					this.message.showMessageforFalseResult(data);
				}
			});
		}
	}

	back() {
		location.replace(this.auth.indexUrl);
	}
}