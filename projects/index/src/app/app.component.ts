import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
   
    constructor(
        private auth: AuthService,
        private title: Title
    ) { }

    ngOnInit(): void {
        this.title.setTitle(`مجتمع آموزشی ${this.auth.schoolTitle}`);
    }
}
