import { Component, OnInit } from '@angular/core';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { IPost } from 'src/app/Dashboard/WebSiteManagment/post/post';

declare var $: any;

@Component({
    selector: 'app-feed',
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

    feeds: IPost[] = [];

    constructor(
        private auth: AuthService,
        private message: MessageService
    ) { }

    ngOnInit() {
        this.auth.post("/api/Post/getAllFeedIndex").subscribe((data: jsondata) => {
            if (data.success) {
                this.feeds = data.data;

                var $newsTicker = $('.newsticker__list');

                if ($newsTicker.length) {
                    $newsTicker.newsTicker({
                        row_height: 34,
                        max_rows: 1,
                        prevButton: $('#newsticker-button--prev'),
                        nextButton: $('#newsticker-button--next')
                    });
                }
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

    }

}
