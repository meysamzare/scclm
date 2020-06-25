import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MenuService } from '../../services/menu/menu.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

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
    @Input() backToPureMenuUrl = false;
    @Input() isEdit = false;
    @Input() icon = "";
    @Input() color = "";
    @Input() size: "small" | "normal" | "medium" | "large" = "normal";

    @Output() onClick = new EventEmitter<any>();

    constructor(
        private menu: MenuService,
        private route: Router,
        private location: Location
    ) { }

    ngOnInit() {
    }

    clicked() {
        if (!this.disabled) {
            if (this.backToPureMenuUrl) {
                if (this.isEdit) {
                     this.location.back();
                } else {
                    this.route.navigateByUrl(this.menu.getCurrentPureUrl().link);
                }
                return;
            }
            this.onClick.next();
        }
    }

}
