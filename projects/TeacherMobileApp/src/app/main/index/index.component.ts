import { Component, OnInit } from '@angular/core';
import { TeacherAuthService } from '../../services/teacher-auth.service';
import { IExam } from 'src/app/Dashboard/Exam/exam/exam';
import { ICourse } from 'src/app/Dashboard/course/course';
import { ClassBookService } from '../class-book/class-book.service';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

    upComingExams: IExam[] = [];

    registredCourses: any[] = [];

    constructor(
        public tchAuth: TeacherAuthService,
        private classBookServ: ClassBookService
    ) { }

    ngOnInit() {

        this.tchAuth.auth.post("/api/Teacher/getAllRegistredCourseByTeacher", this.tchAuth.getTeacherId()).subscribe(data => {
            if (data.success) {
                this.registredCourses = data.data;
            } else {
                this.tchAuth.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.tchAuth.auth.handlerError(er);
        });

        this.tchAuth.auth.post("/api/Exam/getUpComingExamInWeekByTeacher", this.tchAuth.getTeacherId()).subscribe(data => {
            if (data.success) {
                this.upComingExams = data.data;
            } else {
                this.tchAuth.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.tchAuth.auth.handlerError(er);
        });
    }

}
