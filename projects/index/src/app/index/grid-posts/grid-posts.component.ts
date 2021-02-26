import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { getPostTypeString } from 'src/app/Dashboard/WebSiteManagment/post/post';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
    selector: 'app-grid-posts',
    templateUrl: './grid-posts.component.html',
    styleUrls: ['./grid-posts.component.scss']
})
export class GridPostsComponent implements OnInit {

    type = 0;

    isLoading = false;

    posts = [];

    totalCount = 0;

    page = 1;
    pageSize = 30;
    sort = "new";
    searchText = "";
    searchLastMonth = false;
    searchLast15 = false;
    searchTags: string[] = [];
    searchAuthors: string[] = [];

    constructor(
        public auth: AuthService,
        private message: MessageService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private sanitizer: DomSanitizer,
    ) { }

    ngOnInit() {
        this.activeRoute.queryParams.subscribe(qparam => {

            const queryType = qparam["type"];

            this.type = queryType || 0;

            this.refreshPosts();
        });
    }


    isFirstHighList(post): boolean {
        const highListPostes = this.posts.filter(c => c.isHighLight);

        if (highListPostes && highListPostes.indexOf(post) == 0) {
            return true;
        }

        return false;
    }

    getBackgroundImageUrl(post) {
        return this.sanitizer.bypassSecurityTrustStyle(`url("${this.auth.getFileUrl(post.headerPicUrl)}")`);
    }


    refreshPosts() {
        this.isLoading = true;
        this.auth.post("/api/Post/GetIndex", {
            page: this.page,
            size: this.pageSize,
            type: this.type,
            sort: this.sort,
            searchText: this.searchText,
            last15: this.searchLast15,
            lastMonth: this.searchLastMonth,
            tags: this.searchTags,
            authors: this.searchAuthors
        }).pipe(finalize(() => this.isLoading = false)).subscribe(data => {
            if (data.success) {
                this.posts = data.data;
                this.totalCount = +data.type;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }


    getTypeString() {
        const postType = this.type;

        return getPostTypeString(postType, this.auth.fadakTitle, this.auth.hedayatTahsiliTitle, this.auth.blogTitle, this.auth.bargozideganTitle, this.auth.porseshMotadavelTitle, this.auth.ehrazeHoviatTitle);
    }

}
