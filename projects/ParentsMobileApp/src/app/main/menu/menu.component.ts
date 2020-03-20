import { Component, OnInit, OnDestroy } from '@angular/core';
import { MoreService } from '../more/more.service';
import { interval } from 'rxjs';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {


    updateInterval = null;

    constructor(
        public moreService: MoreService
    ) { }

    ngOnInit() {
        this.updateInterval = interval(10000).subscribe(value => {
            this.moreService.refreshTicketAndNotification();
        });

        this.moreService.refreshTicketAndNotification();
    }

    ngOnDestroy() {
        this.updateInterval.unsubscribe();
    }

}
