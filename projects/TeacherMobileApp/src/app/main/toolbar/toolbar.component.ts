import { Component, OnInit, Input } from '@angular/core';
import { ThemeService } from 'projects/ParentsMobileApp/src/app/service/theme.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';

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
    @Input() Title = "";

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

}
