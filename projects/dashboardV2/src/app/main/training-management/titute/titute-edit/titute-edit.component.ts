import { Component, OnInit } from '@angular/core';
import { TituteRepositoryService } from '../titute-repository.service';
import { ITitute } from 'src/app/Dashboard/titute/titute';
import { TreeService } from 'projects/dashboardV2/src/app/shared/reusable-component/tree/tree.service';

@Component({
    selector: 'app-titute-edit',
    templateUrl: './titute-edit.component.html',
    styleUrls: ['./titute-edit.component.scss']
})
export class TituteEditComponent implements OnInit {

    titutes: ITitute[] = [];

    constructor(
        private tituteRep: TituteRepositoryService,
        public tree: TreeService
    ) { }

    async ngOnInit() {
        this.titutes = await this.tituteRep.getAll();
    }

}
