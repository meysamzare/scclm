import { Component, OnInit } from '@angular/core';
import { TreeService } from 'projects/dashboardV2/src/app/shared/reusable-component/tree/tree.service';

@Component({
    selector: 'app-titute-list',
    templateUrl: './titute-list.component.html',
    styleUrls: ['./titute-list.component.scss']
})
export class TituteListComponent implements OnInit {

    constructor(
        public tree: TreeService
    ) { }

    ngOnInit() {
    }

}
