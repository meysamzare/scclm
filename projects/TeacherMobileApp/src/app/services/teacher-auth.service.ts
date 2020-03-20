import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import * as cryptoJSON from 'crypto-json';
import { ITeacher } from 'src/app/Dashboard/teacher/teacher';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class TeacherAuthService {

    teacherKEY = "_tch"

    isUserHaveToChangePass = false;

    private password = "@^HSBB^@571{A)^#KJS&%^@*()@*(#SDUI";

    constructor(
        public auth: AuthService,
        public router: Router
    ) { 
        if (this.isLoggedin(true)) {
            this.isUserHaveToChangePass = this.isPasswordWeek();
        }
    }

    setTeacher(teacher: ITeacher) {
        let enc_Tch = cryptoJSON.encrypt(teacher, this.password)
        localStorage.setItem(this.teacherKEY, JSON.stringify(enc_Tch));
    }

    getTeacher(): ITeacher | null {
        var item = localStorage.getItem(this.teacherKEY);

        if (item) {
            var tch = cryptoJSON.decrypt(JSON.parse(item), this.password)

            return tch;
        } else {
            return null;
        }
    }

    removeTeacher() {
        localStorage.removeItem(this.teacherKEY);
    }

    
    isLoggedin(checkTeacher = false): boolean {

        const helper = new JwtHelperService();

        var token = this.auth.getToken();

        if (!token) {
            return false;
        }

        const isExpired = helper.isTokenExpired(token);
        if (isExpired) {
            return false;
        }

        if (checkTeacher) {
            if (this.getTeacher() == null || this.getTeacher().id == 0) {
                return false;
            }
        }

        return true;
    }

    
    logout(redirect = true) {
        this.removeTeacher();

        this.auth.removeToken();

        if (redirect) {
            this.router.navigateByUrl("/login");
        }
    }

    
    isPasswordWeek(): boolean {
        var pass = this.getTeacher().password;

        if (pass == "1" || pass == "12345678") {
            return true;
        }

        return false;
    }


    getTeacherId(): number {
        return this.getTeacher().id;
    }

    getTeacherName(): string {
        return this.getTeacher().name;
    }
}