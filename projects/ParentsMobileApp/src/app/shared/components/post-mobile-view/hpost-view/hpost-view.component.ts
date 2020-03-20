import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IPost } from 'src/app/Dashboard/WebSiteManagment/post/post';

@Component({
    selector: 'app-hpost-view',
    templateUrl: './hpost-view.component.html',
    styleUrls: ['./hpost-view.component.scss']
})
export class HPostViewComponent implements OnInit {

    @Input() public Type: "special" | "blog" = "blog";

    posts: IPost[] = [];

    isLoading = true;

    Title = "آخرین مطالب سایت";

    constructor(
        public auth: AuthService
    ) { }

    ngOnInit() {
        this.getTitle();
        
        if (this.Type == "special") {
            this.auth.post("/api/Post/getLastSpecialPostIndex").subscribe(data => {
                if (data.success) {
                    this.posts = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }

        if (this.Type == "blog") {
            this.auth.post("/api/Post/getLastPostIndex").subscribe(data => {
                if (data.success) {
                    this.posts = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }

    }

    getTitle() {
        if (this.Type == "special") {
            this.Title = "آخرین مطالب ویژه سایت";
        }
        if (this.Type == "blog") {
            this.Title = "آخرین مطالب سایت";
        }
    }

}