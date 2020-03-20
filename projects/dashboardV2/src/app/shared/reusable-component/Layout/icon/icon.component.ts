import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {

    @Input() type: "fa" | "mat" = "fa";

    @Input() icon = "";

    @Input() size = "";

    @Input() color: "info" | "success" | "warning" | "danger" | "" = "";

    constructor() { }

    ngOnInit() {
    }

}
