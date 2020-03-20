import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { IMainSlideShow } from 'src/app/Dashboard/WebSiteManagment/main-slide-show/main-slide-show';
import { MessageService } from 'src/app/shared/services/message.service';

declare var $: any;

@Component({
	selector: 'app-slider',
	templateUrl: './slider.component.html',
	styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, AfterViewInit {
	ngAfterViewInit(): void {
		$("#main-slider").carousel();
	}

	slides: IMainSlideShow[] = [];

	constructor(
		private auth: AuthService,
		private message: MessageService
	) { }

	ngOnInit() {
		this.auth.post("/api/MainSlideShow/getAllIndex").subscribe((data: jsondata) => {
			if (data.success) {
				this.slides = data.data;
				$("#main-slider").carousel();
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
