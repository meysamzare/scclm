import { Component, OnInit, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'app-col',
    templateUrl: './col.component.html',
    styleUrls: ['./col.component.scss']
})
export class ColComponent implements OnInit {

    @Input() classes = "";

    @HostBinding('class') componentClass = "column ";

    constructor() { }

    ngOnInit() {
        this.componentClass += this.classes;
    }

}
