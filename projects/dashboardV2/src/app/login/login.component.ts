import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { finalize } from 'rxjs/operators';
import { IFileInputReturn } from '../shared/reusable-component/input/file/file.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    username = "";
    password = "";

    isLoading = false;

    selectVal = null;
    textAreaVal = "";
    checkboxVal = true;

    file: IFileInputReturn = null;

    constructor(
        private auth: AuthService
    ) { }

    ngOnInit() {
        
    }

    onFileChange(value) {
        console.log(value);
        
    }

    doLogin() {
        this.isLoading = true;
        this.auth.Login(this.username, this.password, {
            type: 'View',
            agentId: 0,
            agentType: 'User',
            agentName: this.username,
            tableName: 'Login To dashboardV2 App',
            logSource: 'dashboard',
            object: {
                username: this.username,
                password: this.password
            },
        }, "").pipe(finalize(() => this.isLoading = false)).subscribe();
    }

}
