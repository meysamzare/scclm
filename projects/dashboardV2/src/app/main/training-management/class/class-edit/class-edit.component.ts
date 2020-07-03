import { Component, OnInit } from '@angular/core';
import { GradeRepositoryService } from '../../grade/grade-repository.service';

@Component({
    selector: 'app-class-edit',
    templateUrl: './class-edit.component.html',
    styleUrls: ['./class-edit.component.scss']
})
export class ClassEditComponent implements OnInit {

    grades = [];

    constructor(
        private gradeRepo: GradeRepositoryService
    ) { }

    async ngOnInit() {
        this.grades = await this.gradeRepo.getAll();
    }

}
