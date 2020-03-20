import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IAdvertising } from 'src/app/Dashboard/WebSiteManagment/advertising/advertising';

@Component({
    selector: 'advertising',
    templateUrl: './advertising.component.html',
    styleUrls: ['./advertising.component.scss']
})
export class AdvertisingComponent implements OnInit {

    ads: IAdvertising[] = [];

    @Input() public Type = 1;

    constructor(
        public auth: AuthService
    ) { }

    ngOnInit() {
        this.auth.post("/api/Advertising/getAllByType", this.Type).subscribe(data => {
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
