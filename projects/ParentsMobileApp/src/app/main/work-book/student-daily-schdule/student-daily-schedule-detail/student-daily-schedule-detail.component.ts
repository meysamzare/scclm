import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentAuthService } from 'projects/ParentsMobileApp/src/app/service/parent-student-auth.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { IStudentDailySchedule } from '../student-daily-schdule';

@Component({
    selector: 'app-student-daily-schedule-detail',
    templateUrl: './student-daily-schedule-detail.component.html',
    styleUrls: ['./student-daily-schedule-detail.component.scss']
})
export class StudentDailyScheduleDetailComponent implements OnInit {

    isLoading = false;

    studentDailySchedule = new IStudentDailySchedule();

    Id = 0;

    stdParentCommnet = "";

    constructor(
        private stdAuth: StudentAuthService,
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

        this.stdAuth.auth.post("/api/StudentDailySchedule/getStudentDailySchedule", this.Id)
            .pipe(finalize(() => this.isLoading = false)).subscribe(data => {
                if (data.success) {
                    this.studentDailySchedule = data.data;
                } else {
                    this.stdAuth.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.stdAuth.auth.handlerError(er);
            });
    }

    closeTab() {
        window.close();
    }

    setParentCommnet() {
        this.isLoading = true;

        this.stdAuth.auth.post("/api/StudentDailySchedule/setParentComment", {
            id: this.Id,
            comment: this.stdParentCommnet
        }).pipe(finalize(() => this.isLoading = false)).subscribe(data => {
            if (data.success) {
                this.refreshSDS();

                this.stdAuth.auth.message.showSuccessAlert();
            } else {
                this.stdAuth.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.stdAuth.auth.handlerError(er);
        });
    }

}
