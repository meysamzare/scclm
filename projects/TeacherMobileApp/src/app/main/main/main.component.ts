import { Component, OnInit, HostListener, AfterViewChecked, ViewChild } from '@angular/core';
import { MainService } from './main.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewChecked {

    constructor(
        public mainServ: MainService
    ) { }

    ngOnInit() {

    }

    ngAfterViewChecked(): void {
    }

    onMainDivScroll(event) {
        if (event.srcElement.scrollTop < 100) {
            this.mainServ.onMainDivScrollTop();
        }
    }

}
