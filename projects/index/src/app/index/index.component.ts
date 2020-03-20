import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ICategory } from 'src/app/Dashboard/category/category';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { LogService } from 'src/app/shared/services/log.service';
import { interval } from 'rxjs';
import { IAdvertising } from 'src/app/Dashboard/WebSiteManagment/advertising/advertising';

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy, AfterViewInit {

	categorys: ICategory[] = [];
	catData: ICategory[] = [];

	ads: IAdvertising[] = [];

	serverDate = "";

	interval1;
	interval2;

	constructor(
		public auth: AuthService,
		private message: MessageService,
		private log: LogService
	) {
		this.refreshCats();

		this.interval1 = interval(500).subscribe(x => {
			this.categorys = this.catData;
		});

		this.interval2 = interval(2000 * 60).subscribe(x => {
			this.refreshCats();
		});

	}


	getFileUrl(url): string {
		return this.auth.apiUrl + url.substr(1);
	}


	ngOnDestroy(): void {
		this.interval1.unsubscribe();
		this.interval2.unsubscribe();
	}

	refreshCats() {
		this.auth
			.post("/api/Category/getAllIndex", null)
			.subscribe((data: jsondata) => {
				if (data.success) {
					this.catData = data.data;
				} else {
					this.message.showMessageforFalseResult(data);
				}
			});
	}

	isValidToShow(cat: ICategory): boolean {
		if (cat.isActive) {
			return true;
		} else {
			return false;
		}
	}

	isValidToShowForInfo(cat: ICategory): boolean {
		return cat.isInfoShow;
	}

	isValidToShowForEntringCard(cat: ICategory): boolean {
		return cat.haveEntringCard;

	}

	ngOnInit(): void {
		this.auth.post("/api/Advertising/getAllByType", 2).subscribe((data: jsondata) => {
			if (data.success) {
				this.ads = data.data;
			} else {
				this.message.showMessageforFalseResult(data);
			}
		}, er => {
			this.auth.handlerError(er);
		});
	}

	isLoginStdValid() {
		var nowDate = new Date();
		var eventDate = new Date("2019-06-23T07:00:00");

		return nowDate > eventDate;
	}

	ngAfterViewInit(): void {
	}

	getCatByRow(showRow) {
		return this.categorys.filter(c => c.showRow == showRow);
	}
}
