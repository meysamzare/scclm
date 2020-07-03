import { Component, OnInit } from '@angular/core';
import { DaysOfWeekRepositoryService } from '../../days-of-week/days-of-week-repository.service';
import { TeacherRepositoryService } from '../../teacher/teacher-repository.service';
import { CourseRepositoryService } from '../../course/course-repository.service';

@Component({
    selector: 'app-time-schedule-edit',
    templateUrl: './time-schedule-edit.component.html',
    styleUrls: ['./time-schedule-edit.component.scss']
})
export class TimeScheduleEditComponent implements OnInit {

    daysOfWeek = [];
    teachers = [];
    courses = [];

    constructor(
        private daysOfWeekRepo: DaysOfWeekRepositoryService,
        private teacherRepo: TeacherRepositoryService,
        private courseRepo: CourseRepositoryService
    ) { }

    async ngOnInit() {
        this.daysOfWeek = await this.daysOfWeekRepo.getAll();
        this.teachers = await this.teacherRepo.getAll();
        this.courses = await this.courseRepo.getAll();
    }

}
