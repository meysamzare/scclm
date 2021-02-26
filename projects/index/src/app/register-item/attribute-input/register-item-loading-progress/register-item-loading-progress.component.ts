import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-register-item-loading-progress',
    templateUrl: './register-item-loading-progress.component.html',
    styleUrls: ['./register-item-loading-progress.component.scss']
})
export class RegisterItemLoadingProgressComponent implements OnInit {

    @Input() uploaded_MB = 0;
    @Input() uploaded_PS = 0;
    @Input() fileSize_MB = 0;

    constructor() { }

    ngOnInit() {
    }

}
