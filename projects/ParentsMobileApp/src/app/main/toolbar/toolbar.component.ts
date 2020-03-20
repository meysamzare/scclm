import { Component, OnInit, ContentChildren, QueryList, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ThemeService } from '../../service/theme.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

    @Input() showBackButton = false;
    @Input() showColorButton = false;
    @Input() showToolbar = true;
    @Input() showTitle = true;
    @Input() showIcon = true;
    @Input() showRefresh = true;
    @Input() showShadow = true;
    @Input() Title = "";

    @Output() RefreshClick: EventEmitter<any> = new EventEmitter();

    constructor(
        public themeSrv: ThemeService,
        private location: Location,
        private router: Router,
        private docTitle: Title
    ) { }

    ngOnInit() {
        this.docTitle.setTitle("مبنا | " + this.Title);

        if (this.showToolbar) {
            document.getElementById("main").style.marginTop = "45px";
        } else {
            document.getElementById("main").style.marginTop = "0px";
        }
    }


    back() {
        this.location.back();
    }

    
    reload() {
        document.location.reload();
    }

    getShadowColor() {
        if (this.showShadow) {
            return "0px 0px 3px black";
        }

        return "unset"
    }
}
