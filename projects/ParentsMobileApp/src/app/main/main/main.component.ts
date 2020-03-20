import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from './main.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {


    constructor(
        private mainServ: MainService
    ) { }

    ngOnInit() { }

    ngOnDestroy(): void {
        
    }

    onMainDivScroll(event) {
        if (event.srcElement.scrollTop < 100) {
            this.mainServ.onMainDivScrollTop();
        }
    }

}
