import { Component, OnInit, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'app-col',
    templateUrl: './col.component.html',
    styleUrls: ['./col.component.scss']
})
export class ColComponent implements OnInit {

    @Input() classes = "";

    constructor() { }

    ngOnInit() {
    }

}
