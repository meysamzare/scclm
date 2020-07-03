import { Component, OnInit } from '@angular/core';
import { GradeRepositoryService } from '../../grade/grade-repository.service';
import { TeacherRepositoryService } from '../../teacher/teacher-repository.service';

@Component({
    selector: 'app-course-list',
    templateUrl: './course-list.component.html',
    styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

    grades = [];
    teachers = [];

    selectedGrade = null;
    selectedTeacher = null;

    constructor(
        private gradeRepo: GradeRepositoryService,
        private teacherRepo: TeacherRepositoryService
    ) { }

    async ngOnInit() {
        this.grades = await this.gradeRepo.getAll();
        this.teachers = await this.teacherRepo.getAll();
    }

}
