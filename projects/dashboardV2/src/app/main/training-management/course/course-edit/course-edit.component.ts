import { Component, OnInit } from '@angular/core';
import { GradeRepositoryService } from '../../grade/grade-repository.service';
import { TeacherRepositoryService } from '../../teacher/teacher-repository.service';

@Component({
    selector: 'app-course-edit',
    templateUrl: './course-edit.component.html',
    styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent implements OnInit {

    grades = [];
    teachers = [];

    constructor(
        private gradeRepo: GradeRepositoryService,
        private teacherRepo: TeacherRepositoryService
    ) { }

    async ngOnInit() {
        this.grades = await this.gradeRepo.getAll();
        this.teachers = await this.teacherRepo.getAll();
    }

}
