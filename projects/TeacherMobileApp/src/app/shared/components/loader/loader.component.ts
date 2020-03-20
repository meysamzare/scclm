import { Component, OnInit, Input } from '@angular/core';
import { LoaderService } from 'public/Services/http-interceptor/loader.service';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

    @Input() marginTop = 50;

    constructor(
        public loader: LoaderService
    ) { }

    ngOnInit() {
    }

}
