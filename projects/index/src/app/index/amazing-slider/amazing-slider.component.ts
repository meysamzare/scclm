import { Component, OnInit } from '@angular/core';
import { ISchedule } from 'src/app/Dashboard/WebSiteManagment/schedule/schedule';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
	selector: 'app-amazing-slider',
	templateUrl: './amazing-slider.component.html',
	styleUrls: ['./amazing-slider.component.scss']
})
export class AmazingSliderComponent implements OnInit {

	schedules: ISchedule[] = [];


	owlOption = {
		rtl: true,
		margin: 10,
		nav: true,
		navText: ['<i class="now-ui-icons arrows-1_minimal-right"></i>', '<i class="now-ui-icons arrows-1_minimal-left"></i>'],
		dots: false,
		responsiveClass: true,
		responsive: {
			0: {
				items: 2,
				slideBy: 1
			},
			576: {
				items: 2,
				slideBy: 1
			},
			768: {
				items: 3,
				slideBy: 2
			},
			992: {
				items: 3,
				slideBy: 2
			},
			1400: {
				items: 4,
				slideBy: 3
			}
		}
	}

	constructor(
		public auth: AuthService,
		private message: MessageService
	) { }

	ngOnInit() {

		this.auth.post("/api/Schedule/getSchedulesIndex").subscribe((data: jsondata) => {
			if (data.success) {
				this.schedules = data.data;
			} else {
				this.message.showMessageforFalseResult(data);
			}
		}, er => {
			this.auth.handlerError(er);
		});
	}

	getSplitedTags(tags: string): string[] {

		var sta: string[] = [];

		tags.split(",").forEach(st => {
			sta.push(st);
		});

		return sta;
	}

	months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	]

	getAsCustomDate(val) {
		var date = new Date(val);

		var monthString = this.months[date.getMonth()]

		var monthNum = date.getMonth() + 1;
		var dayNum = date.getDay() + 1;

		return `${date.getFullYear()}-${monthNum.toString().length == 1 ? "0" + monthNum : monthNum}-${dayNum.toString().length == 1 ? "0" + dayNum : dayNum} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	}

}
