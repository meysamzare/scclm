import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { IComment } from '../../comment';

@Component({
    selector: 'app-comment-location',
    templateUrl: './comment-location.component.html',
    styleUrls: ['./comment-location.component.scss']
})
export class CommentLocationComponent implements OnInit {

    commentId = 0;

    relatedComments: IComment[] = [];

    constructor(
        public dialogRef: MatDialogRef<CommentLocationComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
        private message: MessageService
    ) {
        this.commentId = data.id;

        let obj = {
            commentId: this.commentId,
            totalType: data.totalType,
        }

        this.auth.post("/api/Comment/getRelatedComment", obj, {
            type: 'View',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Post Comment Location',
            logSource: 'dashboard',
            object: obj,
        }).subscribe(data => {
            if (data.success) {
                this.relatedComments = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    ngOnInit() {
    }

}
