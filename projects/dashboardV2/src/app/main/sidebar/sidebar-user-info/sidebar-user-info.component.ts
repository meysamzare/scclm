import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
    selector: 'app-sidebar-user-info',
    templateUrl: './sidebar-user-info.component.html',
    styleUrls: ['./sidebar-user-info.component.scss']
})
export class SidebarUserInfoComponent implements OnInit {

    menuActive = false;

    constructor(
        public auth: AuthService
    ) { }

    ngOnInit() { }
}
