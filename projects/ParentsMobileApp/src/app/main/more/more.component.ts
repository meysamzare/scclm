import { Component, OnInit } from '@angular/core';
import { StudentAuthService } from '../../service/parent-student-auth.service';
import { MoreService } from './more.service';

@Component({
    selector: 'app-more',
    templateUrl: './more.component.html',
    styleUrls: ['./more.component.scss']
})
export class MoreComponent implements OnInit {

    constructor(
        public stdAuth: StudentAuthService,
        public moreService: MoreService
    ) { }

    ngOnInit() { }

    reload() {
        document.location.reload();
    }

}
