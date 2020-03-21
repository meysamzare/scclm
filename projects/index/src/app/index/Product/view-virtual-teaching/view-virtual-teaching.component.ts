import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { IProduct } from 'src/app/Dashboard/Products/Product/product';
import { IWriter } from 'src/app/Dashboard/Products/Writer/writer';
import { ILink } from 'src/app/Dashboard/Products/Link/link';
import { IProductComment } from 'src/app/Dashboard/WebSiteManagment/comment/product-comment';
import { finalize, debounceTime } from 'rxjs/operators';
import { LinkService } from '../link.service';
import { Subject } from 'rxjs/internal/Subject';
import { MediaMatcher } from '@angular/cdk/layout';

declare var $: any;

@Component({
    selector: 'app-view-virtual-teaching',
    templateUrl: './view-virtual-teaching.component.html',
    styleUrls: ['./view-virtual-teaching.component.scss']
})
export class ViewVirtualTeachingComponent implements OnInit, OnDestroy {

    product: IProduct = new IProduct();
    writer: IWriter = new IWriter();
    links: ILink[] = [];
    comments: IProductComment[] = [];
    comment: IProductComment = new IProductComment();


    replayId = 0;
    replayName = "";
    replayContent = "";
    isCommentPanelExpend = false;

    trustedProductContect = null;

    isLoading = true;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    constructor(
        public auth: AuthService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private link: LinkService,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
    ) { 
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    setLike$ = new Subject<{ id: any, like: boolean }>();

    ngOnInit() {
        this.auth.post("/api/Product/getProductIndex", this.activeRoute.snapshot.params["id"])
            .pipe(finalize(() => {
                this.isLoading = false;
            }))
            .subscribe(data => {
                if (data.success) {
                    var product = data.data;

                    this.writer = product.writer;
                    this.links = product.links;
                    this.product = product;
                    this.comments = product.comments;

                    this.comment.productId = this.product.id;

                    this.trustedProductContect = this.getTrustedHtml(this.product.desc);
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

        this.setLike$.pipe(
            debounceTime(1500)
        ).subscribe((data) => {

            this.auth.post("/api/Link/setLike", {
                id: data.id,
                like: !data.like
            }).subscribe(jdata => {
                if (jdata.success) {
                    let link = this.links.find(c => c.id == data.id);

                    if (data.like) {
                        this.link.removeLiked(data.id);
                        link.like += -1;
                    } else {
                        this.link.addLiked(data.id);
                        link.like += 1;
                    }
                }
            });

        });
    }

    getImgBackground() {
        let style = 'linear-gradient(#004092, #020202, transparent), url(' + this.auth.getFileUrl(this.product.picUrl) + ') no-repeat center';

        return this.sanitizer.bypassSecurityTrustStyle(style)
    }

    getLikeCount(link: ILink) {
        return link.like + (this.link.isLiked(link.id) ? 1 : 0);
    }

    setLinkViewed(id) {
        if (!this.link.isViewed(id)) {
            this.auth.post("/api/Link/setSee", id).subscribe();
            this.link.addViewed(id);
        }
    }

    isLiked(id): boolean {
        return this.link.isLiked(id);
    }

    setLike(id) {
        this.setLike$.next({
            id: id,
            like: this.isLiked(id)
        });
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

        this.auth.post("/api/Comment/setProductComment", this.comment, {
            type: 'Add',
            agentId: 0,
            agentType: 'Other',
            agentName: "",
            tableName: 'ProductComment (VirtualTeaching) (From Index)',
            logSource: 'Index',
            object: this.comment,
        }).subscribe(data => {
            if (data.success) {
                this.auth.message.showSuccessAlert("نظر شما ارسال شد و پس از بررسی منتشر خواهد شد");
                this.commentCancel();
            } else {
                this.auth.message.showMessageforFalseResult(data);
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

}
