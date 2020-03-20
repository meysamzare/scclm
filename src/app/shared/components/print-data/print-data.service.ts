import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jsondata } from '../../Auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class PrintDataService {

    tableHeaders: string[] = [];

    tabledData: Array<Array<string>> = [];

    printTitle: string = "";

    redirectUrl?: string = null;

    Type: 1 | 2 = 1;

    htmlContent: string = "";

    constructor(
        private router: Router,
        private sanitizer: DomSanitizer
    ) { }


    setPrintDatasAndRedirect(data: jsondata, redirectUrl?) {
        this.printTitle = "";
        this.tableHeaders = [];
        this.tabledData = [];

        if (redirectUrl) {
            this.redirectUrl = redirectUrl;
        }

        this.printTitle = data.data.title;
        this.tableHeaders = data.data.headers;
        this.tabledData = data.data.datas;

        this.Type = 1;

        this.router.navigate(["/print"], { skipLocationChange: true });
    }

    printHtmlContent(html: string, redirectUrl?) {

        if (redirectUrl) {
            this.redirectUrl = redirectUrl;
        }

        this.Type = 2;

        this.htmlContent = html;

        this.router.navigate(["/print"], { skipLocationChange: true });
    }

    getSerializeHtmlContent() {
        return this.sanitizer.bypassSecurityTrustHtml(this.htmlContent);
    }
}
