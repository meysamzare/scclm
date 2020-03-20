import { Component, OnInit } from '@angular/core';
import { TeacherAuthService } from '../../services/teacher-auth.service';

@Component({
    selector: 'app-more',
    templateUrl: './more.component.html',
    styleUrls: ['./more.component.scss']
})
export class MoreComponent implements OnInit {

    constructor(
        public tchAuth: TeacherAuthService
    ) { }

    ngOnInit() {
    }

    reload() {
        document.location.reload();
    }

}
