import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IPost } from 'src/app/Dashboard/WebSiteManagment/post/post';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
    selector: 'app-last-posts-grid',
    templateUrl: './last-posts-grid.component.html',
    styleUrls: ['./last-posts-grid.component.scss']
})
export class LastPostsGridComponent implements OnInit {

    lastPosts: IPost[] = [];

    constructor(
        public auth: AuthService,
        private sanitizer: DomSanitizer,
    ) { }

    ngOnInit() {
        this.auth.post("/api/Post/getLastPostIndex").subscribe(data => {
            if (data.success) {
                this.lastPosts = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    isFirstHighList(post: IPost): boolean {
        const highListPostes = this.lastPosts.filter(c => c.isHighLight);

        if (highListPostes && highListPostes.indexOf(post) == 0) {
            return true;
        }

        return false;
    }

    getBackgroundImageUrl(post: IPost) {
        return this.sanitizer.bypassSecurityTrustStyle(`url("${this.auth.getFileUrl(post.headerPicUrl)}")`);
    }
}
