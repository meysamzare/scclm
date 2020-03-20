import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IStudent } from 'src/app/Dashboard/student/student';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import * as cryptoJSON from 'crypto-json';
import { MessageService } from 'src/app/shared/services/message.service';
import { StdClassMng } from 'src/app/Dashboard/student/stdClassMng';
import { IDBService } from './idb.service';

@Injectable({
    providedIn: 'root'
})
export class StudentAuthService {

    studentKEY = "_std";

    isUserHaveToChangePass = false;

    private password = "@^HSBB^@571{A";

    constructor(
        public auth: AuthService,
        private router: Router,
        private message: MessageService,
        private idb: IDBService
    ) {
        if (this.isLoggedin(true)) {
            this.isUserHaveToChangePass = this.isPasswordWeek();
        }
    }


    setStudent(student: IStudent) {

        this.idb.getObjectStore().then(objectStore => {
            objectStore.add(student);
        })

        let enc_Std = cryptoJSON.encrypt(student, this.password)
        localStorage.setItem(this.studentKEY, JSON.stringify(enc_Std));
    }

    getStudent(): IStudent | null {



        var item = localStorage.getItem(this.studentKEY);

        if (item) {
            var std = cryptoJSON.decrypt(JSON.parse(item), this.password)

            return std;
        } else {
            return null;
        }
    }

    removeStudent() {

        this.idb.getObjectStore().then((obstore) => {
            obstore.clear();
        });

        localStorage.removeItem(this.studentKEY);
    }

    isLoggedin(checkStudent = false): boolean {

        const helper = new JwtHelperService();

        var token = this.auth.getToken();

        if (!token) {
            return false;
        }

        const isExpired = helper.isTokenExpired(token);
        if (isExpired) {
            return false;
        }

        if (checkStudent) {
            if (this.getStudent() == null || this.getStudent().id == 0) {
                return false;
            }
        }

        return true;
    }

    logout(redirect = true) {
        this.removeStudent();

        this.auth.removeToken();

        if (redirect) {
            this.router.navigateByUrl("/login");
        }
    }

    getStudentFullName() {
        var std = this.getStudent();

        return std.name + " " + std.lastName;
    }

    getActiveStdClassMng(): StdClassMng | null {
        var std = (this.getStudent() as any);

        var stdClassMngs: StdClassMng[] = std.stdClassMngs;

        if (stdClassMngs) {
            let activeClassMng: StdClassMng = null;
            stdClassMngs.forEach(scm => {
                if (scm.isActive) {
                    activeClassMng = scm;
                }
            });

            return activeClassMng;
        }

        return null;
    }

    isPasswordWeek(): boolean {
        var pass = this.getStudent().parentsPassword ? this.getStudent().parentsPassword : "";

        if (pass == "1" || pass == "12345678") {
            return true;
        }

        return false;
    }
}