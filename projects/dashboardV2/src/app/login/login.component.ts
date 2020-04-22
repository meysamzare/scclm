import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { finalize } from 'rxjs/operators';
import { IFileInputReturn } from '../shared/reusable-component/input/file/file.component';
import { TreeService } from '../shared/reusable-component/tree/tree.service';

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

    dateVal = "";

    constructor(
        private auth: AuthService,
        public tree: TreeService
    ) { }

    ngOnInit() {
        // getNowDate
        this.auth.post("/api/Category/getNowDate").subscribe(data => {
            if (data.success) {
                this.dateVal = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
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
        }, "").pipe(finalize(() => this.isLoading = false)).toPromise();
    }

    sendDateToServer() {
        this.auth.post("/api/Category/getDate", this.dateVal).subscribe(data => {
            if (data.success) {
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

}
