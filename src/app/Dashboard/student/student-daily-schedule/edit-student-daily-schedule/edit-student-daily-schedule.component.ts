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

    stdParentCommnet = "";

    courses: ICourse[] = [];

    constructor(
        private auth: AuthService,
        private activeRoute: ActivatedRoute
    ) {
        this.activeRoute.params.subscribe(params => {
            this.Id = params["id"];

            this.refreshSDS();

            
            this.auth.post("/api/Course/getAllByGrade", 0).subscribe(data => {
                if (data.success) {
                    this.courses = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        });
    }

    ngOnInit() {
    }
    
    refreshSDS() {
        this.isLoading = true;

        this.auth.post("/api/StudentDailySchedule/getStudentDailySchedule", this.Id)
            .pipe(finalize(() => this.isLoading = false)).subscribe(data => {
                if (data.success) {
                    this.studentDailySchedule = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
    }

    setParentCommnet() {
        this.isLoading = true;

        this.auth.post("/api/StudentDailySchedule/setParentComment", {
            id: this.Id,
            comment: this.stdParentCommnet
        }).pipe(finalize(() => this.isLoading = false)).subscribe(data => {
            if (data.success) {
                this.refreshSDS();

                this.auth.message.showSuccessAlert();
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }


}
