import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IOnlineClass } from 'src/app/Dashboard/OnlineClass/online-class';
import { finalize } from 'rxjs/operators';
import { BigBlueButtonRepositoryService } from 'public/Services/big-blue-button/big-blue-button-repository.service';

@Component({
    selector: 'app-online-class-mobile-list',
    templateUrl: './online-class-mobile-list.component.html',
    styleUrls: ['./online-class-mobile-list.component.scss']
})
export class OnlineClassMobileListComponent implements OnInit {

    @Input() isAdmin = false;


    @Input() gradeId: number = null;
    @Input() classId: number = null;
    @Input() courseId: number = null;

    @Input() userFullName = "";
    @Input() userId = "";


    @Input() additionalTitle = "";

    onlineClasses: IOnlineClass[] = [];

    isLoading = false;

    constructor(
        private auth: AuthService,
        private bbbRepo: BigBlueButtonRepositoryService
    ) { }

    ngOnInit() {
        this.refreshOnlineClasses();
    }

    refreshOnlineClasses() {
        this.isLoading = true;

        this.auth.post("/api/OnlineClass/getAllByGrade_Class_Course", {
            gradeId: this.gradeId,
            classId: this.classId,
            courseId: this.courseId,
            isAdmin: this.isAdmin,
            userId: this.userId,
        }).pipe(finalize(() => this.isLoading = false)).subscribe(data => {
            if (data.success) {
                this.onlineClasses = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

}
