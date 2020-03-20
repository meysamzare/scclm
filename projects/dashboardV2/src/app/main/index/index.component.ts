import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

    txt = null;

    data = {
        a: 1,
        b: 2,
        name: "ab"
    };

    filter1 = null;
    filter2 = null;

    constructor() { }

    ngOnInit() {
    }

    alert() {
        alert("delete");
    }

}
