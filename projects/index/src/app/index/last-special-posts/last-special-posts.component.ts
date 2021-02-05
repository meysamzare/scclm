import { Component, OnInit } from '@angular/core';
import { IPost } from 'src/app/Dashboard/WebSiteManagment/post/post';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
    selector: 'app-last-special-posts',
    templateUrl: './last-special-posts.component.html',
    styleUrls: ['./last-special-posts.component.scss']
})
export class LastSpecialPostsComponent implements OnInit {


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
    ) { 
        
        this.auth.post("/api/Post/getLastSpecialPostIndex").subscribe(data => {
            if (data.success) {
                this.lastSpecialPosts = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    ngOnInit() {
    }

    getFileUrl(url) {
        if (url) {
            return this.auth.getFileUrl(url);
        }
    }
}
