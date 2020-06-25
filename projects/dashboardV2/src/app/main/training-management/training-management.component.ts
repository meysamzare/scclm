import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../shared/services/menu/menu.service';

@Component({
    selector: 'app-training-management',
    templateUrl: './training-management.component.html',
    styleUrls: ['./training-management.component.scss']
})
export class TrainingManagementComponent implements OnInit {

    constructor(
        public menu: MenuService
    ) { }

    ngOnInit() {
    }
}
