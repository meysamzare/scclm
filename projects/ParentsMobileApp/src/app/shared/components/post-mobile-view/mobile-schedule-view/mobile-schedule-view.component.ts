import { Component, OnInit } from '@angular/core';
import { ISchedule } from 'src/app/Dashboard/WebSiteManagment/schedule/schedule';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
    selector: 'app-mobile-schedule-view',
    templateUrl: './mobile-schedule-view.component.html',
    styleUrls: ['./mobile-schedule-view.component.scss']
})
export class MobileScheduleViewComponent implements OnInit {

    schedules: ISchedule[] = [];

    constructor(
        public auth: AuthService
    ) { }

    ngOnInit() {
        this.auth.post("/api/Schedule/getSchedulesIndex").subscribe(data => {
			if (data.success) {
				this.schedules = data.data;
			} else {
				this.auth.message.showMessageforFalseResult(data);
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

		return sta.slice(0, 3);
	}

}
