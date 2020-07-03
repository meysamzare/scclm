import { Component, OnInit } from '@angular/core';
import { TeacherRepositoryService } from '../teacher-repository.service';
import { MenuService } from 'projects/dashboardV2/src/app/shared/services/menu/menu.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-teacher-list',
    templateUrl: './teacher-list.component.html',
    styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit {

    accessFilter = null;

    constructor(
        public teacherRepo: TeacherRepositoryService,
        private menu: MenuService,
        private router: Router
    ) { }

    ngOnInit() {
    }

    goToOrgPersonEdit(orgpersonId) {
        try {
            let menu = this.menu.getMenuByApiUrl("OrgPerson");

            this.router.navigateByUrl(`${menu.link}/edit/${orgpersonId}`);
        } catch { }
    }

}
