import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
	selector: 'app-responsive-header',
	templateUrl: './responsive-header.component.html',
	styleUrls: ['./responsive-header.component.scss']
})
export class ResponsiveHeaderComponent implements OnInit {

	constructor(
		public auth: AuthService,
		private message: MessageService
	) { }

	ngOnInit() {
	}
	
	gotoLogin() {
		location.replace(this.auth.dashboardUrl);
	}


}
