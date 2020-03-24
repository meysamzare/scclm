import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../../services/menu/menu.service';

@Component({
    selector: 'app-menu-intro',
    templateUrl: './menu-intro.component.html',
    styleUrls: ['./menu-intro.component.scss']
})
export class MenuIntroComponent implements OnInit {

    constructor(
        public menu: MenuService
    ) { }

    ngOnInit() {
    }

}
