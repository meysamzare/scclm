import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IComment } from 'src/app/Dashboard/WebSiteManagment/comment/comment';

@Component({
    selector: 'app-post-comment',
    templateUrl: './post-comment.component.html',
    styleUrls: ['./post-comment.component.scss']
})
export class PostCommentComponent implements OnInit {

    @Input() comments: any[] = [];

    @Input() parentId: number = null;
    @Input() showReplayLink: boolean = true;
    @Input() showCommentPic: boolean = true;
    @Input() showCommentId: boolean = false;
    @Input() hilightCommentId: number = null;

    @Output() onReplay: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    getCommnetWithParentId(): any[] {
        return this.comments.filter(c => c.parentId == this.parentId);
    }

    replayClicked(commentId, commentName, commentContent): void {
        this.onReplay.emit({
            id: commentId,
            name: commentName,
            content: commentContent
        });
    }

}
