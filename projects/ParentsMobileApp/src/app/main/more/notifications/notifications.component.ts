import { Component, OnInit, OnDestroy } from '@angular/core';
import { StudentAuthService } from '../../../service/parent-student-auth.service';
import { INotification, NotificationShowType, getNotificationTypeColorClass } from 'src/app/Dashboard/notification/notification';
import { MoreService } from '../more.service';
import { MainServiceWorkerService } from '../../../service/main-service-worker.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

    notifications: INotification[] = [];

    search = "";

    page = 1;

    totalCount = 0;

    isLoading = true;

    constructor(
        private stdAuth: StudentAuthService,
        public moreService: MoreService,
        public mainSW: MainServiceWorkerService
    ) { }

    ngOnInit() {
        this.refreshNotifications(true);
    }

    ngOnDestroy(): void {
        var ids: number[] = [];

        this.notifications.forEach(noti => {
            var notiId = noti.id;
            if (!this.moreService.isNotificationContainsReads(notiId)) {
                ids.push(notiId);
            }

            this.moreService.pushReadNotificationId(notiId);
        });

        if (ids.length != 0) {
            this.stdAuth.auth.post("/api/Notification/setNotificationSeen", {
                NotificationIds: ids,
                AgentName: this.stdAuth.getStudentFullName(),
                AgentId: this.stdAuth.getStudent().id,
                AgentType: 1,
                ClassId: this.stdAuth.getActiveStdClassMng().classId,
                GradeId: this.stdAuth.getActiveStdClassMng().gradeId
            }).subscribe(data => {
                if (data.success) {
                } else {
                    this.stdAuth.auth.message.showMessageforFalseResult(data);

                    this.stdAuth.auth.message.showErrorAlert("خطا در ذخیره سازی برخی داده ها لطفا با مدیر سیستم تماس حاصل فرمایید");
                }
            }, er => {
                this.stdAuth.auth.handlerError(er);
            });
        }
    }

    refreshNotifications(clearListThenAdd = false) {
        this.isLoading = true;
        
        if (clearListThenAdd) {
            this.page = 1;
            this.notifications = [];
        }
        
        this.stdAuth.auth.post("/api/Notification/getAllByShowType", {
            showType: NotificationShowType.StudentParent,
            q: this.search,
            page: this.page
        }, {
            type: 'View',
            agentId: this.stdAuth.getStudent().id,
            agentType: 'StudentParent',
            agentName: this.stdAuth.getStudentFullName(),
            tableName: 'Notification List',
            logSource: 'PMA',
            object: {
                showType: NotificationShowType.StudentParent,
                q: this.search,
                page: this.page
            },
        }).subscribe(data => {
            if (data.success) {

                var notifications: INotification[] = data.data.notis;
                notifications.forEach(notification => {
                    this.notifications.push(notification);
                });

                this.totalCount = data.data.count;

            } else {
                this.stdAuth.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.stdAuth.auth.handlerError(er);
        }, () => {
            this.isLoading = false;
        });
    }

    getNotificationClassByType(type) {
        return getNotificationTypeColorClass(type);
    }



    canShowMoreButton() {
        var nowItemCount = this.notifications.length;
        var totalItemCount = this.totalCount;

        if (nowItemCount < totalItemCount && this.notifications.length != 0) {
            return true;
        }

        return false;
    }

    nextPage() {
        this.page += 1;

        this.refreshNotifications();
    }
}
