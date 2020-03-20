import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IWriter } from 'src/app/Dashboard/Products/Writer/writer';
import { DomSanitizer } from '@angular/platform-browser';
import { IProduct } from 'src/app/Dashboard/Products/Product/product';
import { ILink } from 'src/app/Dashboard/Products/Link/link';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

    product: IProduct = new IProduct();
    writer: IWriter = new IWriter();
    links: ILink[] = [];

    trustedProductContect = null;

    isLoading = true;

    constructor(
        public auth: AuthService,
        private message: MessageService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private sanitizer: DomSanitizer,
    ) { }

    ngOnInit() {
        this.auth.post("/api/Product/getProductIndex", this.activeRoute.snapshot.params["id"]).subscribe(data => {
            if (data.success) {
                var product = data.data;

                this.writer = product.writer;
                this.links = product.links;
                this.product = product;


                this.trustedProductContect = this.getTrustedHtml(this.product.desc);
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        }, () => {
            this.isLoading = false;
        });
    }


    getTrustedHtml(content) {
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }


    getProductWriterString(type, writer) {
        if (type == 0 || type == 1) {
            return `نویسنده: ${writer}`;
        }

        if (type == 2) {
            return `مدرس: ${writer}`;
        }
    }

    getProductTypeString(type, value) {
        if (type == 0 || type == 1) {
            return `${value} صفحه`;
        }

        if (type == 2) {
            return `${value} دقیقه`;
        }
    }

    addDownloadCount(id) {
        this.auth.post("/api/Link/setDownload", id).subscribe();
    }

}
