import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../shared/services/menu/menu.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {


    constructor(
        public menu: MenuService,
        public router: Router
    ) { }

    ngOnInit() {
    }

}
