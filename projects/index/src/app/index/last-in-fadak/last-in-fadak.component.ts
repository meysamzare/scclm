import { Component, OnInit } from '@angular/core';
import { IPost } from 'src/app/Dashboard/WebSiteManagment/post/post';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
	selector: 'app-last-in-fadak',
	templateUrl: './last-in-fadak.component.html',
	styleUrls: ['./last-in-fadak.component.scss']
})
export class LastInFadakComponent implements OnInit {
	lastFadak: IPost[] = [];


	owlOption = {
		rtl: true,
		margin: 10,
		nav: true,
		navText: ['<i class="now-ui-icons arrows-1_minimal-right"></i>', '<i class="now-ui-icons arrows-1_minimal-left"></i>'],
		dots: false,
		responsiveClass: true,
		responsive: {
			0: {
				items: 3,
				slideBy: 1
			},
			576: {
				items: 3,
				slideBy: 1
			},
			768: {
				items: 5,
				slideBy: 2
			},
			992: {
				items: 5,
				slideBy: 2
			},
			1400: {
				items: 6,
				slideBy: 3
			}
		}
	}

	constructor(
		private auth: AuthService,
		private message: MessageService
	) { }

	ngOnInit() {

		this.auth.post("/api/Post/getLastFadakIndex").subscribe((data: jsondata) => {
			if (data.success) {
				this.lastFadak = data.data;
			} else {
				this.message.showMessageforFalseResult(data);
			}
		}, er => {
			this.auth.handlerError(er);
		});
	}

	getFileUrl(url) {
		return this.auth.getFileUrl(url);
	}

}
