import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	constructor(
		public auth: AuthService
	) { }

	ngOnInit() {
	}

	gotoLogin() {
		location.replace(this.auth.dashboardUrl);
	}

}
