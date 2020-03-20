import { Component, OnInit } from '@angular/core';
import { IPost } from 'src/app/Dashboard/WebSiteManagment/post/post';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';

declare var $: any;

@Component({
    selector: 'app-last-in-site',
    templateUrl: './last-in-site.component.html',
    styleUrls: ['./last-in-site.component.scss']
})
export class LastInSiteComponent implements OnInit {

    lastPost: IPost[] = [];

    lastSpecialPosts: IPost[] = [];

    owlOption = {
        rtl: true,
        margin: 10,
        nav: true,
        navText: ['<i class="now-ui-icons arrows-1_minimal-right"></i>', '<i class="now-ui-icons arrows-1_minimal-left"></i>'],
        dots: false,
        responsiveClass: true,
        responsive: {
            0: {
                items: 3,
                slideBy: 1
            },
            576: {
                items: 3,
                slideBy: 1
            },
            768: {
                items: 5,
                slideBy: 2
            },
            992: {
                items: 5,
                slideBy: 2
            },
            1400: {
                items: 6,
                slideBy: 3
            }
        }
    }

    constructor(
        private auth: AuthService,
        private message: MessageService
    ) {

        this.auth.post("/api/Post/getLastPostIndex").subscribe((data: jsondata) => {
            if (data.success) {
                this.lastPost = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

        this.auth.post("/api/Post/getLastSpecialPostIndex").subscribe((data: jsondata) => {
            if (data.success) {
                this.lastSpecialPosts = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    ngOnInit() { }

    getFileUrl(url) {
        if (url) {
            return this.auth.getFileUrl(url);
        }
    }
}
