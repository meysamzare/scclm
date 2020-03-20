import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { PrintDataService } from './print-data.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
    selector: 'app-print-data',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './print-data.component.html',
    styleUrls: ['./print-data.component.scss']
})
export class PrintDataComponent implements OnInit, AfterViewInit {

    constructor(
        public printDataService: PrintDataService,
        private router: Router
    ) { }

    ngOnInit() { }

    ngAfterViewInit(): void {
        $(() => {
            window.print();

            if (this.printDataService.redirectUrl) {
                this.router.navigateByUrl(this.printDataService.redirectUrl);
            }
        })
    }

}