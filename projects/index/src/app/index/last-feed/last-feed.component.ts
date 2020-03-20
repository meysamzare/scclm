import { Component, OnInit } from '@angular/core';
import { IPost } from 'src/app/Dashboard/WebSiteManagment/post/post';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
	selector: 'app-last-feed',
	templateUrl: './last-feed.component.html',
	styleUrls: ['./last-feed.component.scss']
})
export class LastFeedComponent implements OnInit {

	lastFeeds: IPost[] = [];

	constructor(
		private auth: AuthService,
		private message: MessageService
	) { }

	ngOnInit() {

		this.auth.post("/api/Post/getLastNewsIndex").subscribe((data: jsondata) => {
			if (data.success) {
				this.lastFeeds = data.data;
			} else {
				this.message.showMessageforFalseResult(data);
			}
		}, er => {
			this.auth.handlerError(er);
		});
	}

}
