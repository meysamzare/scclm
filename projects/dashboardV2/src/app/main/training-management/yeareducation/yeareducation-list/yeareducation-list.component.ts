import { Component, OnInit, ViewChild } from '@angular/core';
import { YeareducationRepositoryService } from '../yeareducation-repository.service';
import { DataListComponent } from 'projects/dashboardV2/src/app/shared/reusable-component/data/data-list/data-list.component';

@Component({
    selector: 'app-yeareducation-list',
    templateUrl: './yeareducation-list.component.html',
    styleUrls: ['./yeareducation-list.component.scss']
})
export class YeareducationListComponent implements OnInit {

    @ViewChild("list", { static: false }) list: DataListComponent;

    constructor(
        private yeareducationRep: YeareducationRepositoryService
    ) { }

    ngOnInit() {
    }


    async setIsActive(id) {
        let success = await this.yeareducationRep.setActiveYeareducation(id);

        if (success) {
            this.list.refreshDataSource();
        }
    }

}