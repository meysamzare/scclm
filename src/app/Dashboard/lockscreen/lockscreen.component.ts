import { Component } from "@angular/core";
import { AuthService } from "src/app/shared/Auth/auth.service";



@Component({
    templateUrl: "./lockscreen.component.html"
})
export class LockScreenComponent {

    password = "";

    constructor(
        public auth: AuthService
    ) { }

    Login() {
        if (this.password) {
            this.auth.Login(this.auth.getUser().username, this.password);
        }
    }
}