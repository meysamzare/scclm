import { Injectable, APP_INITIALIZER, Injector } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from "@angular/common/http";
import { MessageService } from "../services/message.service";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { IUser } from "src/app/Dashboard/user/user";
import { RoleClass } from "src/app/Dashboard/role/role";
import { DomSanitizer } from "@angular/platform-browser";
import { Observable, of, EMPTY } from "rxjs";
import { take, switchMap, tap, catchError } from "rxjs/operators";
import { MatDialog } from "@angular/material";

import * as cryptoJSON from 'crypto-json';
import { ILogParam, getAssinedPropNameAndValue, ILog, ILogServer } from "./log";
import { IDBService } from "projects/ParentsMobileApp/src/app/service/idb.service";
import * as CryptoJS from 'crypto-js';
import { DraftService } from "public/Services/draft/draft.service";

export interface IData {
    apiUrl: string;

    dashboardUrl: string;

    indexUrl: string;

    parentMobileAppUrl: string;

    teacherMobileAppUrl: string;

    showRecaptcha: boolean;

    dashboardRecapchaSiteKey: string;
    dashboardRecapchaSecretKey: string;

    pushNotificationPublicKeyPMA: string;
    pushNotificationPrivateKeyPMA: string;

    pushNotificationPublicKeyTMA: string;
    pushNotificationPrivateKeyTMA: string;
}


export interface IParams {
    Name: string;
    Value: any;
}

export interface jsondata {
    success: boolean;
    data: any;
    message: string;
    type: string;
    redirect: string;
}

@Injectable({
    providedIn: "root"
})
export class AuthService {

    private get router() { return this._injector.get(Router); }

    constructor(
        public http: HttpClient,
        public message: MessageService,
        // private router: Router,
        private sanitizer: DomSanitizer,
        private dialogRef: MatDialog,
        private _injector: Injector,
        private idb: IDBService,
        public draft: DraftService
    ) { }

    public User: IUser;
    UserRole: RoleClass;

    redirectUrl: string;

    private password = "@^HSBB^@571{A545421q289UQAU1187Q67&#^&^#&";

    tokenKey = "_tk";
    userKey = "_us";
    lockUserKey = "_lku";
    userRoleKey = "_usro";
    secretKey = "^%&JKSHAKDHYUISIUD&^^%$#@*&^#@*";



    DASHBOARD_VERSION = "1.0.0 Beta 8";

    INDEX_VERSION = "3.1.9 Build 9201";

    PARENTMOBILEAPP_VERSION = "2.9.3 Build 9700";
    
    TMA_VERSION = "1.9.1 Build 4500";


    public apiUrl: string;
    public dashboardUrl: string;
    public indexUrl: string;
    public parentMobileAppUrl: string;
    public teacherMobileAppUrl: string;

    public showRecaptcha: boolean;

    public dashboardRecapchaSiteKey: string;
    public dashboardRecapchaSecretKey: string;

    public pushNotificationPublicKeyTMA: string;
    public pushNotificationPrivateKeyTMA: string;

    public pushNotificationPublicKeyPMA: string;
    public pushNotificationPrivateKeyPMA: string;



    load(http: HttpClient, type: "promise" | "observable" = "promise") {
        var req = http.get('./assets/config/data.json').pipe(
            tap((data: IData) => {
                this.apiUrl = data.apiUrl;
                this.dashboardUrl = data.dashboardUrl;
                this.indexUrl = data.indexUrl;
                this.parentMobileAppUrl = data.parentMobileAppUrl;
                this.teacherMobileAppUrl = data.teacherMobileAppUrl;
                this.showRecaptcha = data.showRecaptcha;
                this.dashboardRecapchaSiteKey = data.dashboardRecapchaSiteKey;
                this.dashboardRecapchaSecretKey = data.dashboardRecapchaSecretKey;
                this.pushNotificationPublicKeyPMA = data.pushNotificationPublicKeyPMA;
                this.pushNotificationPrivateKeyPMA = data.pushNotificationPrivateKeyPMA;
                this.pushNotificationPublicKeyTMA = data.pushNotificationPublicKeyTMA;
                this.pushNotificationPrivateKeyTMA = data.pushNotificationPrivateKeyTMA;

                this.idb.getObjectStore(this.idb.dbApiStoreName).then((obstore) => {
                    obstore.getAll().onsuccess = (e) => {
                        var apis: string[] = (e.target as any).result;
                        var apisLenght = apis.length;

                        if (apisLenght == 0) {
                            obstore.add(this.apiUrl);
                        } else {
                            if (apis[apisLenght - 1] != this.apiUrl) {
                                obstore.clear();
                                obstore.add(this.apiUrl);
                            }
                        }
                    }
                });
            })
        );

        if (type == "promise") {
            return req.toPromise();
        }

        if (type == "observable") {
            return req;
        }
    }


    // public getStaticData(): IData {
    //     var data = require("../../../data/data." + TYPE + ".json");

    //     return {
    //         apiUrl: data.apiUrl,
    //         dashboardUrl: data.dashboardUrl,
    //         indexUrl: data.indexUrl,
    //         parentMobileAppUrl: data.parentMobileAppUrl,
    //         teacherMobileAppUrl: data.teacherMobileAppUrl,
    //         showRecaptcha: data.showRecaptcha,
    //         dashboardRecapchaSecretKey: data.dashboardRecapchaSecretKey,
    //         dashboardRecapchaSiteKey: data.dashboardRecapchaSiteKey,
    //         pushNotificationPublicKeyPMA: data.pushNotificationPublicKeyPMA,
    //         pushNotificationPrivateKeyPMA: data.pushNotificationPrivateKeyPMA,
    //         pushNotificationPublicKeyTMA: data.pushNotificationPublicKeyTMA,
    //         pushNotificationPrivateKeyTMA: data.pushNotificationPrivateKeyTMA
    //     }
    // }


    getFileUrl(url): string {
        return this.apiUrl + url.substr(1);
    }

    Login(username, password, log?: ILogParam, redirect = "dashboard") {

        let req = this.post("/api/User/Login", {
            username: username,
            password: password
        }, log);

        req.subscribe(data => {
            if (data.success) {
                this.message.showSuccessAlert("با موفقیت وارد شدید");

                this.setUser(data.data);
                this.setUserRole(data.data.role);
                this.setToken(data.redirect);

                this.clearLockUserState();

                if (this.redirectUrl) {
                    // location.href = "/#" + this.redirectUrl;
                    this.router.navigateByUrl(this.redirectUrl);
                } else {
                    // location.href = "/#" + "/dashboard";
                    this.router.navigateByUrl(`/${redirect}`);
                }


                // location.reload();
            }
        });

        return req;
    }

    lockUser() {
        var oldUser = this.getUser();

        var user: any = {
            username: oldUser.username,
            fullName: oldUser.fullName,
            picUrl: oldUser.picUrl
        };

        this.clearUser();

        this.setUser(user);
        this.setToken("");

        this.setLockUserState(true);

        this.dialogRef.closeAll();

        this.router.navigate(["/lockscreen"], { skipLocationChange: true });
    }

    setLockUserState(state) {
        localStorage.setItem(this.lockUserKey, state);
    }

    getLockUserState() {
        return localStorage.getItem(this.lockUserKey);
    }

    clearLockUserState() {
        localStorage.removeItem(this.lockUserKey);
    }

    isUserLocked(): boolean {
        let state: boolean;

        if (this.getToken() == "") {
            if (this.getLockUserState()) {
                return true;
            } else {
                state = false;
            }
        } else {
            return false;
        }

        return state;
    }

    isUserAccess(role: string, showAlert = true): boolean {
        var userRole = this.getUserRole();
        let bool = (userRole as any)[role];

        if (bool) {
            return true;
        } else {
            if (showAlert) {
                this.noRoleAccess();
            }
            return false;
        }
    }

    isUserAccessGroup(roles: string[]): boolean {
        var roleCount = roles.length;
        var userRole = this.getUserRole();

        var noAccessList: string[] = [];

        roles.forEach(role => {
            let bool = (userRole as any)[role];

            if (!bool) {
                noAccessList.push(role);
            }
        });

        if (roleCount == noAccessList.length) {
            return false;
        }

        return true;
    }

    checkForMatchRole(roleId: number): boolean {
        if (roleId == 0) {
            return true;
        }

        if (!roleId) {
            return true;
        }

        if (this.getUserRole().id == roleId) {
            return true;
        } else {
            this.message.showWarningAlert(
                "شما مجاز به انجام عملیات بر روی این نمون برگ نیستید"
            );
            return false;
        }
    }

    noRoleAccess() {
        this.message.showWarningAlert(
            "شما مجوز استفاده از این قسمت را ندارید",
            "خطا"
        );
        // if (url){
        //     this.router.navigate([url]);
        // }else{
        //     this.router.navigate(['/dashboard']);
        // }
        // this.router.navigateByUrl = url;
    }

    getUserProfilePic() {
        var pic = this.getUser().picUrl;

        if (!pic) {
            return "";
        }

        return this.getFileUrl(pic);
    }

    sanitize(url: string) {
        if (url) {
            return this.sanitizer.bypassSecurityTrustUrl(url);
        } else {
            return "";
        }
    }


    getTrustedContent(content: string) {
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }


    encript(value: string): string {
        return CryptoJS.AES.encrypt(value, this.password).toString();
    }

    decript(text: string): string {
        return CryptoJS.AES.decrypt(text, this.password).toString(CryptoJS.enc.Utf8);
    }

    // encript(text) {
    //     console.log(CryptoJS);

    //     return CryptoJS.AES.encrypt(text, this.secretKey).toString();
    // }

    // decript(text) {
    //     return CryptoJS.AES.decrypt(text, this.secretKey);
    // }

    getToken(): string | null {

        var item = localStorage.getItem(this.tokenKey);

        if (item) {
            var token = cryptoJSON.decrypt(JSON.parse(item), this.password)

            return token.tk;
        } else {
            return null;
        }

        // return localStorage.getItem(this.tokenKey);
    }

    setToken(token: string) {

        this.idb.getObjectStore(this.idb.dbTokenStoreName).then((obstore) => {
            obstore.add(token);
        });

        let enc_Token = cryptoJSON.encrypt({ tk: token }, this.password)
        localStorage.setItem(this.tokenKey, JSON.stringify(enc_Token));

        // localStorage.setItem(this.tokenKey, token);
    }

    removeToken() {

        this.idb.getObjectStore(this.idb.dbTokenStoreName).then((obstore) => {
            obstore.clear();
        });

        localStorage.removeItem(this.tokenKey);
    }

    setUser(user: IUser) {


        this.idb.getObjectStore(this.idb.dbUserStoreName).then((obstore) => {
            obstore.add(user);
        });

        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    removeUser() {

        this.idb.getObjectStore(this.idb.dbUserStoreName).then((obstore) => {
            obstore.clear();
        });

        localStorage.removeItem(this.userKey);
    }

    getUser(): IUser {

        // return this.getEncriptLocalStorageItem(this.userKey);

        let val = localStorage.getItem(this.userKey);

        if (val) {
            return JSON.parse(val);
        }
        return new IUser();
    }

    getUserId() {
        var userId = this.getUser().id;
        return userId;
    }

    setUserRole(role: RoleClass) {
        // this.setEncriptLocalStorageItem(this.userRoleKey, role);
        localStorage.setItem(this.userRoleKey, JSON.stringify(role));
    }

    removeUserRole() {
        localStorage.removeItem(this.userRoleKey);
    }

    getUserRole(): RoleClass {

        // return this.getEncriptLocalStorageItem(this.userRoleKey);

        let val = localStorage.getItem(this.userRoleKey);

        if (val) {
            return JSON.parse(val);
        }
        return new RoleClass();
    }

    setEncriptLocalStorageItem(name: string, item: any, password = this.password) {
        let enc_Item = cryptoJSON.encrypt(item, password)
        localStorage.setItem(name, JSON.stringify(enc_Item));
    }

    getEncriptLocalStorageItem(name: string, password = this.password): any | null {

        var item = localStorage.getItem(name);

        if (item) {
            var val = cryptoJSON.decrypt(JSON.parse(item), password)

            return val;
        } else {
            return null;
        }
    }

    refreshUserData() {
        this.post("/api/User/GetUser", this.getUser().id).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.setUser(data.data);
                    this.setUserRole(data.data.role);
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }
        );
    }

    Logout(haveNavigate = true) {
        this.clearUser();

        if (haveNavigate) {
            this.router.navigate(["/login"]);
        }


    }

    clearUser() {
        this.setToken("");

        this.removeUser();
        this.removeUserRole();
    }

    getTokenExpirationDate(): Date {
        const helper = new JwtHelperService();

        const token = this.getToken();

        return helper.getTokenExpirationDate(token);
    }

    isUserLoggedin(): boolean {
        let state: boolean;

        const helper = new JwtHelperService();

        var token = this.getToken();
        var user = this.getUser();

        if (!user) {
            state = false;
            this.Logout(false);
        } else {
            const isExpired = helper.isTokenExpired(token);
            if (isExpired) {
                state = false;
                this.Logout(false);
            } else {
                state = true;
            }
        }

        return state;
    }

    isUserLoggedinGuard(): boolean {
        let state: boolean;

        const helper = new JwtHelperService();

        var token = this.getToken();
        var user = this.getUser();

        if (!user) {
            state = false;
        } else {
            const isExpired = helper.isTokenExpired(token);
            if (isExpired) {
                state = false;
            } else {
                state = true;
            }
        }

        return state;
    }

    logToServer(log: ILogParam, JsonData?) {

        var serverLog: ILogServer = new ILogServer();

        serverLog.agentId = log.agentId;
        serverLog.agentName = log.agentName;
        serverLog.agentType = log.agentType;
        serverLog.logSource = log.logSource;

        serverLog.event = log.tableName;
        serverLog.table = log.table;
        serverLog.tableObjectIds = log.tableObjectIds;
        serverLog.type = log.type;

        serverLog.object = log.object;
        serverLog.oldObject = log.oldObject;
        serverLog.deleteObjects = log.deleteObjects;

        serverLog.responseData = JsonData;
        
        serverLog.desc = log.desc;


        // if (log.type == "Add") {
        //     var objectText = getAssinedPropNameAndValue(log.object);

        //     serverLog.desc = `Add New Data To: '${log.tableName}' & Object is: {${objectText}} \n and JsonData is: ${data}`;
        // }

        // if (log.type == "Edit") {
        //     var objectText = getAssinedPropNameAndValue(log.object);
        //     var oldObjectText = getAssinedPropNameAndValue(log.oldObject);

        //     serverLog.desc = `Edit Data in: '${log.tableName}' \n & NewObject is: {${objectText}} & OldObject was: {${oldObjectText}} \n and JsonData is: ${data}`;
        // }

        // if (log.type == "Delete") {

        //     var deteledObjects = `\n`;

        //     log.deleteObjects.forEach(obj => {
        //         var objText = getAssinedPropNameAndValue(obj);

        //         deteledObjects = deteledObjects + `{${objText}}, \n`;
        //     });

        //     serverLog.desc = `Delete Object(s) from Table: ${log.tableName} & Deleted Object(s) was: [${deteledObjects}] \n and JsonData is: ${data}`
        // }

        // if (log.type == "View") {
        //     var objectText = getAssinedPropNameAndValue(log.object);

        //     serverLog.desc = `View ${log.tableName}, And Object is: ${objectText} \n and JsonData is: ${data}`;
        // }

        this.post("/api/Log/setLog", serverLog).subscribe(data => {
            if (data.success) {
                // Do Nothing
            } else {
                this.message.showWarningAlert("خطا در ذخیره برخی داده ها، لطفا با مدیر سیستم تماس حاصل فرمایید");
            }
        });
    }


    post(
        url: string,
        params = null,
        log: ILogParam = null,
        reportProgress = false
    ) {
        var url2 = this.serializeUrl(url);

        let content = JSON.stringify(params);
        var token = this.getToken();
        var req = this.http.post<jsondata>(url2, content, {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }),
            reportProgress: reportProgress
        }).pipe(
            take(1),
            catchError((er, ca) => {
                this.handlerError(er);

                return of(EMPTY)
            }),
            switchMap((data: jsondata) => {
                if (log && log.type != "none") {
                    if (data.success) {
                        this.logToServer(log, data);
                    }
                }
                if (data && !data.success) {
                    this.message.showMessageforFalseResult(data);
                }
                return of(data);
            })
        );

        return req;
    }

    postRequest(
        url: string,
        params = null
    ) {
        var url2 = this.serializeUrl(url);

        let content = JSON.stringify(params);
        var token = this.getToken();

        var req = new HttpRequest("POST", url2, content, {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }),
            reportProgress: true
        });

        return req;
    }

    postToken(url, token, params?) {
        var url2 = this.serializeUrl(url);

        let content = JSON.stringify(params);
        return this.http.post(url2, content, {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            })
        });
    }

    serializeUrl(url: string) {
        var url2 = url.replace("/api/", this.apiUrl);

        return url2;
    }

    get(url, params?: IParams[]) {
        var url2 = this.serializeUrl(url);

        let Params = new HttpParams();
        var token = this.getToken();

        for (const param of params) {
            Params.append(param.Name, param.Value);
        }
        // Params = Params.append("code", code);

        return this.http.get<any>(url2, {
            params: Params,
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            })
        });
    }

    handlerError(er) {
        if (er.status == 401) {
            this.message.showWarningAlert(
                " زمان اتصال شما به پایان رسیده است، لطفا مجددا وارد شوید",
                "خطا"
            );
            this.Logout();
            return;
        } else if (er.status == 0 || er.status == 504) {
            this.message.showErrorAlert(
                "خطا در دسترسی به سرور، لطفا اتصال شبکه خود را بررسی کنید"
            );
            return;
        }

        this.message.showErrorAlert(er.message, "خطای داخلی");
    }
}