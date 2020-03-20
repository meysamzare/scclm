import { Injectable } from "@angular/core";
import { AuthService, jsondata } from "../Auth/auth.service";
import { MessageService } from "./message.service";
import { ILog } from "../Auth/log";

@Injectable({
    providedIn: "root"
})
export class LogService {
    constructor(
        private auth: AuthService,
        private message: MessageService
    ) { }

    Log(log: ILog) {
        this.auth
            .post("/api/Log/setLog", log)
            .subscribe(
                (data: jsondata) => {
                    if (!data.success) {
                        this.message
                            .showErrorAlert("خطا در ذخیره برخی داده ها لطفا با مدیر سیستم تماس حاصل فرمایید");
                    }
                },
                er => {
                    this.auth.handlerError(er);
                }
            );
    }
}
