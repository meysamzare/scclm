import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentAuthService } from 'projects/ParentsMobileApp/src/app/service/parent-student-auth.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { ICourse } from 'src/app/Dashboard/course/course';
import { IStudentDailySchedule } from '../student-daily-schdule';
import { StudentDailyScheduleService } from '../student-daily-schedule.service';

@Component({
    selector: 'app-add-student-daily-schdule',
    templateUrl: './add-student-daily-schdule.component.html',
    styleUrls: ['./add-student-daily-schdule.component.scss']
})
export class AddStudentDailySchduleComponent implements OnInit {

    stdClassMngId = 0;
    gradeId = 0;

    courses: ICourse[] = [];

    studentDailySchedule = new IStudentDailySchedule();

    isLoading = false;

    constructor(
        private activeRoute: ActivatedRoute,
        private stdAuth: StudentAuthService,
        private studentDailyScheduleService: StudentDailyScheduleService
    ) {
        this.activeRoute.params.subscribe(params => {
            this.stdClassMngId = params["stdClassMngId"];
            this.gradeId = params["gradeId"];

            this.stdAuth.auth.post("/api/Course/getAllByGrade", this.gradeId).subscribe(data => {
                if (data.success) {
                    this.courses = data.data;
                } else {
                    this.stdAuth.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.stdAuth.auth.handlerError(er);
            });

        });
    }

    ngOnInit() {
    }

    sts() {
        this.isLoading = true;

        this.studentDailySchedule.stdClassMngId = this.stdClassMngId;

        this.stdAuth.auth.post("/api/StudentDailySchedule/Add", {
            studentDailySchedule: this.studentDailySchedule,
            stdId: this.stdAuth.getStudent().id
        }).pipe(finalize(() => this.isLoading = false)).subscribe(data => {
            if (data.success) {
                this.stdAuth.auth.message.showSuccessAlert();
                this.studentDailyScheduleService.refreshDatas$.next();
                window.close();
            } else {
                this.stdAuth.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.stdAuth.auth.handlerError(er);
        });
    }

}
