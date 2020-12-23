import { Component, OnInit, OnDestroy } from '@angular/core';
import { IPost, getPostColor, getPostTypeString } from 'src/app/Dashboard/WebSiteManagment/post/post';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { IComment } from 'src/app/Dashboard/WebSiteManagment/comment/comment';
import { DomSanitizer, Meta } from '@angular/platform-browser';

declare var $: any;

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {


    post: IPost = new IPost();

    postId = 0;

    isCommentPanelExpend = false;

    comment: IComment = new IComment();

    postComments: IComment[] = [];

    replayId = 0;
    replayName = "";
    replayContent = "";

    postSeenKEY = "psen";

    TrustedPostContent = null;

    constructor(
        public auth: AuthService,
        public message: MessageService,
        private activeRoute: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private meta: Meta
    ) {
        activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.post = data.post;

                this.comment.postId = this.post.id;

                this.TrustedPostContent = this.getTrustedHtml(this.post.content);
            });

            this.auth.post("/api/Comment/getPostComments", this.post.id).subscribe((data: jsondata) => {
                if (data.success) {
                    this.postComments = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

            this.postId = params["id"];

            this.addPostToSeen(this.postId);
        });
    }


    getTypeColor(type) {
        return getPostColor(type);
    }

    getTypeString(type) {
        return getPostTypeString(type, this.auth.fadakTitle, this.auth.hedayatTahsiliTitle, this.auth.blogTitle, this.auth.bargozideganTitle);

    }

    getPostShortUrl() {
        return `${document.location.origin}/#/post/${this.post.id}`;
    }

    addPostToSeen(postId: number) {
        var seenpost = this.getSeenPosts();

        if (!seenpost) {
            seenpost = [];
        }

        var postseen = seenpost.find(c => c == postId);

        if (!postseen) {
            seenpost.push(postId);

            this.setSeenPosts(seenpost);

            this.auth.post("/api/Post/Postse", postId).subscribe((data: jsondata) => {
                if (data.success) {
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }
    }

    setSeenPosts(valus: number[]) {
        localStorage.setItem(this.postSeenKEY, JSON.stringify(valus));
    }

    getSeenPosts(): number[] {
        return JSON.parse(localStorage.getItem(this.postSeenKEY));
    }


    getShiftedTags(tags: string) {
        return tags.split(",");
    }

    ngOnInit() {
        this.meta.addTag({ name: "tags", content: this.post.tags });
        this.meta.addTag({ name: "description", content: this.post.shortContent });
    }

    ngOnDestroy() {
        this.meta.removeTag("tags");
        this.meta.removeTag("description");
    }

    getTrustedHtml(content) {
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }

    commentCancel() {
        this.isCommentPanelExpend = false;

        this.comment.fullName = "";
        this.comment.email = "";
        this.comment.content = "";
        this.comment.parentId = null;

        this.resetReplayObjects();
    }

    openCommentPanel() {
        this.isCommentPanelExpend = true;
    }

    closeCommentPanel() {
        this.isCommentPanelExpend = false;
    }

    resetReplayObjects() {
        this.replayId = 0;
        this.replayName = "";
        this.replayContent = "";
    }

    sendComment() {

        if (this.replayId != 0) {
            this.comment.parentId = this.replayId;
        }

        this.auth.post("/api/Comment/setComment", this.comment, {
            type: 'Add',
            agentId: 0,
            agentType: 'Other',
            agentName: "",
            tableName: 'Comment (From Index)',
            logSource: 'Index',
            object: this.comment,
            table: "Comment"
        }).subscribe((data: jsondata) => {
            if (data.success) {
                this.message.showSuccessAlert("نظر شما ارسال شد و پس از بررسی منتشر خواهد شد");
                this.commentCancel();
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

    }

    setReplay(commentObj) {
        this.replayId = commentObj.id;
        this.replayName = commentObj.name;
        this.replayContent = commentObj.content;

        var divPosition = $('#prpanel').offset();
        $('html, body').animate({ scrollTop: divPosition.top }, "slow");


        this.openCommentPanel();
    }

    cancellReplay() {
        this.resetReplayObjects();

        this.closeCommentPanel();
    }

}
