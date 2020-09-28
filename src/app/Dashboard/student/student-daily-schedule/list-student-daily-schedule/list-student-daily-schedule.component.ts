import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { finalize } from 'rxjs/internal/operators/finalize';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
    selector: 'app-list-student-daily-schedule',
    templateUrl: './list-student-daily-schedule.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./list-student-daily-schedule.component.scss']
})
export class ListStudentDailyScheduleComponent implements OnInit {

    students = [];

    selectedStudent = null;

    studentStdClassMngs = [];

    selectedStdClassMng = null;


    studentDailySchedules = [];


    isLoading = false;


    constructor(
        private auth: AuthService
    ) { }

    ngOnInit() {
        this.isLoading = true;

        this.auth.post("/api/StdClassMng/getAllRegistredStudent")
            .pipe(finalize(() => this.isLoading = false)).subscribe(data => {
                if (data.success) {
                    this.students = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
    }

    onStudentSelect() {
        if (this.selectedStudent) {

            this.isLoading = true;

            this.auth.post("/api/StdClassMng/getAllRegisteredByStudent", this.selectedStudent)
                .pipe(finalize(() => this.isLoading = false)).subscribe(data => {
                    if (data.success) {
                        this.studentStdClassMngs = data.data;
                    } else {
                        this.auth.message.showMessageforFalseResult(data);
                    }
                }, er => {
                    this.auth.handlerError(er);
                });
        }
    }

    showSDSs() {
        if (this.selectedStudent && this.selectedStdClassMng) {

            this.isLoading = true;

            this.auth.post("/api/StudentDailySchedule/getAllByStd", {
                studentId: this.selectedStudent,
                stdClassMngId: this.selectedStdClassMng
            }).pipe(finalize(() => this.isLoading = false)).subscribe(data => {
                if (data.success) {
                    this.studentDailySchedules = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }
    }


    getSDSBackgroundColor(type) {

        if (type == 2) {
            return "#41a141";
        }
        if (type == 3) {
            return "#a74242";
        }
        if (type == 4) {
            return "#a7a442";
        }

        return "";
    }


    setStudentDailyScheduleState(id, state) {
        this.isLoading = true;

        this.auth.post("/api/StudentDailySchedule/SetState", {
            id: id,
            state: state
        }).pipe(finalize(() => this.isLoading = false)).subscribe(data => {
            if (data.success) {
                this.auth.message.showSuccessAlert();
                this.showSDSs();
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }


}
