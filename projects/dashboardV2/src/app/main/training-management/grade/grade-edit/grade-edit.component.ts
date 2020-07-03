import { Component, OnInit } from '@angular/core';
import { TituteRepositoryService } from '../../titute/titute-repository.service';
import { YeareducationRepositoryService } from '../../yeareducation/yeareducation-repository.service';

@Component({
    selector: 'app-grade-edit',
    templateUrl: './grade-edit.component.html',
    styleUrls: ['./grade-edit.component.scss']
})
export class GradeEditComponent implements OnInit {

    titutes = [];
    yeareducations = [];

    constructor(
        private tituteRepo: TituteRepositoryService,
        private yeareducationRepo: YeareducationRepositoryService,
    ) { }

    async ngOnInit() {
        this.titutes = await this.tituteRepo.getAll();
        this.yeareducations = await this.yeareducationRepo.getAll();
    }

}
