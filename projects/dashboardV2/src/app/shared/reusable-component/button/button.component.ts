import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

    @Input() text = "";
    @Input() light = false;
    @Input() fullWidth = false;
    @Input() outlined = false;
    @Input() rounded = false;
    @Input() link = false;
    @Input() loading = false;
    @Input() disabled = false;
    @Input() haveIcon = false;
    @Input() icon = "";
    @Input() color = "";
    @Input() size: "small" | "normal" | "medium" | "large" = "normal";

    @Output() onClick = new EventEmitter<any>();

    constructor() { }

    ngOnInit() {
    }

    clicked() {
        if (!this.disabled) {
            this.onClick.next();
        }
    }

}
