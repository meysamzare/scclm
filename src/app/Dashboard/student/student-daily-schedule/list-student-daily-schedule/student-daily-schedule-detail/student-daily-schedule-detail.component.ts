import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStudentDailySchedule } from 'projects/ParentsMobileApp/src/app/main/work-book/student-daily-schdule/student-daily-schdule';
import { finalize } from 'rxjs/internal/operators/finalize';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
    selector: 'app-student-daily-schedule-detail',
    templateUrl: './student-daily-schedule-detail.component.html',
    styleUrls: ['./student-daily-schedule-detail.component.scss']
})
export class StudentDailyScheduleDetailComponent implements OnInit {

    isLoading = false;

    studentDailySchedule = new IStudentDailySchedule();

    Id = 0;

    stdConsultantComment = "";

    constructor(
        private auth: AuthService,
        private activeRoute: ActivatedRoute,
        public location: Location
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

    closeTab() {
        window.close();
    }

    setConsultantComment() {
        this.isLoading = true;

        this.auth.post("/api/StudentDailySchedule/setConsultantComment", {
            id: this.Id,
            comment: this.stdConsultantComment
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
