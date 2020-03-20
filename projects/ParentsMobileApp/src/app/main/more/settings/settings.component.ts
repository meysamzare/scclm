import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MainServiceWorkerService } from '../../../service/main-service-worker.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {

    constructor(
        public mainSW: MainServiceWorkerService
    ) { }

    ngOnInit() { }

}
