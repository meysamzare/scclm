import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStudentDailySchedule } from 'projects/ParentsMobileApp/src/app/main/work-book/student-daily-schdule/student-daily-schdule';
import { finalize } from 'rxjs/internal/operators/finalize';
import { ICourse } from 'src/app/Dashboard/course/course';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
    selector: 'app-edit-student-daily-schedule',
    templateUrl: './edit-student-daily-schedule.component.html',
    styleUrls: ['./edit-student-daily-schedule.component.scss']
})
export class EditStudentDailyScheduleComponent implements OnInit {

    isLoading = true;

    studentDailySchedule = new IStudentDailySchedule();

    Id = 0;

    courses: ICourse[] = [];

    Title = "";

    constructor(
        private auth: AuthService,
        private activeRoute: ActivatedRoute
    ) {
        this.activeRoute.params.subscribe(params => {
            this.Id = params["id"];

            this.refreshSDS();
        });
    }

    ngOnInit() {
    }

    refreshSDS() {
        this.isLoading = true;

        this.auth.post("/api/StudentDailySchedule/getStudentDailyScheduleWithCourses", this.Id)
            .pipe(finalize(() => this.isLoading = false)).subscribe(data => {
                if (data.success) {
                    this.studentDailySchedule = data.data.sds;
                    this.courses = data.data.courses;

                    this.Title = `ویرایش ${this.studentDailySchedule.typeString} ${this.studentDailySchedule.courseName}`
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
    }

    sts() {
        this.auth.post("/api/StudentDailySchedule/Edit", this.studentDailySchedule).subscribe(data => {
            if (data.success) {
                this.auth.message.showSuccessAlert();

                this.closeTab();
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    closeTab() {
        window.close();
    }


}
