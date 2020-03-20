import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'image-icon',
    templateUrl: './image-icon.component.html',
    styleUrls: ['./image-icon.component.scss']
})
export class ImageIconComponent implements OnInit {

    @Input() icon: string = "";
    @Input() height: number = 30;
    @Input() format: string = "png"

    constructor() { }

    ngOnInit() {
    }

}
