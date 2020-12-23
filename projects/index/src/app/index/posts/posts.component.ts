import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PostType, IPost, getPostTypeString, getPostColor } from 'src/app/Dashboard/WebSiteManagment/post/post';
import { DOCUMENT } from '@angular/common';
import { ICategory } from 'src/app/Dashboard/category/category';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

declare var $: any;

@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

    type = 0;

    sort = "new";

    page = 1;

    pageSize = 8;

    totalCount = 1;

    posts: IPost[] = [];

    isLoadingData = true;

    typeChange: EventEmitter<number> = new EventEmitter<number>();

    catsByType: ICategory[] = [];
    tags: string[] = [];
    authors: string[] = [];

    filterTags = "";
    filterAuthors = "";
    filterCats = "";

    searchLastMonth = false;
    searchLast15 = false;
    searchText = "";
    searchTextSubject$ = new Subject<string>();
    searchTags: string[] = [];
    searchAuthors: string[] = [];


    constructor(
        public auth: AuthService,
        private message: MessageService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        @Inject(DOCUMENT) private document: Document
    ) {

    }

    ngOnInit() {
        this.activeRoute.queryParams.subscribe(qparam => {

            var qparamType = qparam["type"];


            this.type = qparamType || 0;

            if (this.type < 0) {
                this.type = 0;
            }

            if (this.type > 25) {
                this.type = 25;
            }


            this.auth.post("/api/Category/getByType", this.type).subscribe((data: jsondata) => {
                if (data.success) {
                    this.catsByType = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

            this.auth.post("/api/Post/getTagsAuthorsByType", this.type).subscribe((data: jsondata) => {
                if (data.success) {
                    this.tags = data.data.tags;
                    this.authors = data.data.authors;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

            this.searchText = "";


            this.typeChange.next();
        });

        this.typeChange.subscribe(() => {

            this.page = 1;

            this.refreshPosts();


        });

        this.refreshPosts();

        this.searchTextSubject$.pipe(
            debounceTime(700)
        ).subscribe(searchText => {
            this.refreshPosts();
        });

    }

    refreshPosts() {
        this.isLoadingData = true;
        this.auth.post("/api/Post/GetIndex", {
            page: this.page,
            type: this.type,
            sort: this.sort,
            searchText: this.searchText,
            last15: this.searchLast15,
            lastMonth: this.searchLastMonth,
            tags: this.searchTags,
            authors: this.searchAuthors
        }).subscribe((data: jsondata) => {
            if (data.success) {
                this.posts = data.data;
                this.totalCount = +data.type;
                this.isLoadingData = false;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    setSort(sort) {
        this.sort = sort;

        this.page = 1;

        this.refreshPosts();

    }

    getFilterCats(): ICategory[] {
        var filter = this.filterCats;
        var list = this.catsByType;
        if (filter) {
            return list.filter(c => c.title.includes(filter) || c.btnTitle.includes(filter));
        }

        return list;
    }

    getFilterTags(): string[] {
        var filter = this.filterTags;
        var list = this.tags;
        if (filter) {
            this.searchTags = [];
            return list.filter(c => c.includes(filter));
        }

        return list;
    }

    getFilterAuthors(): string[] {
        var filter = this.filterAuthors;
        var list = this.authors;
        if (filter) {
            this.searchAuthors = [];
            return list.filter(c => c.includes(filter));
        }

        return list;
    }

    searchTextChange() {
        this.searchTextSubject$.next();
    }

    setSearchTags(tag, $evant) {
        var stag = this.searchTags.find(c => c == tag);

        if ($evant.checked) {
            if (!stag) {
                this.searchTags.push(tag);
            }
        } else {
            if (stag) {
                this.searchTags.splice(this.searchTags.indexOf(stag), 1);
            }
        }

        this.refreshPosts();
    }

    setSearchAuthors(author, $evant) {
        
        var sauth = this.searchAuthors.find(c => c == author);

        if ($evant.checked) {
            if (!sauth) {
                this.searchAuthors.push(author);
            }
        } else {
            if (sauth) {
                this.searchAuthors.splice(this.searchAuthors.indexOf(sauth), 1);
            }
        }

        this.refreshPosts();
    }

    setPage(event) {
        this.page = event.page;

        $('html,body').animate({ scrollTop: 0 }, 'slow');

        this.refreshPosts();
    }

    isUserInSearch() {
        return this.searchAuthors.length != 0 || this.searchTags.length != 0 || this.searchLast15 || this.searchLastMonth;
    }

    getColor(type?) {
        if (type) {
            return getPostColor(type);
        }
        return getPostColor(this.type);
    }

    getGradentOfTop() {
        return 'linear-gradient(to bottom, ' + this.getColor() + ', #f4f4f4)';
    }


    getTypeString(type?) {
        if (type) {
            return getPostTypeString(type, this.auth.fadakTitle, this.auth.hedayatTahsiliTitle, this.auth.blogTitle, this.auth.bargozideganTitle);
        }
        return getPostTypeString(this.type, this.auth.fadakTitle, this.auth.hedayatTahsiliTitle, this.auth.blogTitle, this.auth.bargozideganTitle);

    }

}
