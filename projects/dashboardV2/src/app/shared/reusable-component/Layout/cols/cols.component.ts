import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
    selector: 'app-cols',
    templateUrl: './cols.component.html',
    styleUrls: ['./cols.component.scss']
})
export class ColsComponent implements OnInit {

    @HostBinding('class') componentClass = "columns";

    constructor() { }

    ngOnInit() {
    }

}
