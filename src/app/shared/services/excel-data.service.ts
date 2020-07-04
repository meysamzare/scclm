import { Injectable } from '@angular/core';
import { AuthService } from '../Auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ExcelDataService {

    constructor(
        private auth: AuthService
    ) { }

    getExcelData(table: string) {
        this.auth.post(`/api/${table}/getDataToExcel`).subscribe(data => {
            if (data.success) {
                var win = window.open(this.auth.getFileUrl(data.redirect), "_blank");
                win.focus();
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }
}
