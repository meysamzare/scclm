import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	constructor(
		private auth: AuthService,
		private message: MessageService
	) { }

	ngOnInit() {
	}

	gotoLogin() {
		location.replace(this.auth.dashboardUrl);
	}

}
