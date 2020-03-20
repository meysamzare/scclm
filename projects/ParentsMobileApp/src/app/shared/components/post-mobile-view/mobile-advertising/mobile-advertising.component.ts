import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IAdvertising } from 'src/app/Dashboard/WebSiteManagment/advertising/advertising';

@Component({
    selector: 'app-mobile-advertising',
    templateUrl: './mobile-advertising.component.html',
    styleUrls: ['./mobile-advertising.component.scss']
})
export class MobileAdvertisingComponent implements OnInit {

    @Input() public Type = 4;

    ads: IAdvertising[] = [];

    constructor(
        public auth: AuthService
    ) { }

    ngOnInit() {
        this.auth.post("/api/Advertising/getAllMobileByType", this.Type).subscribe(data => {
			if (data.success) {
				this.ads = data.data;
			} else {
				this.auth.message.showMessageforFalseResult(data);
			}
		}, er => {
			this.auth.handlerError(er);
		});
    }

}
