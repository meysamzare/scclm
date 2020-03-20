import { Injectable } from '@angular/core';
import { StudentAuthService } from '../../service/parent-student-auth.service';
import { TicketRepositoryService } from 'src/app/Dashboard/ticket/ticket-repository.service';
import { TicketType } from 'src/app/Dashboard/ticket/ticket';
import { INotification, NotificationShowType } from 'src/app/Dashboard/notification/notification';
import * as cryptoJSON from 'crypto-json';

@Injectable({
    providedIn: 'root'
})
export class MoreService {


    unReadTicketsCount = 0;

    lastWeekNotifications: INotification[] = [];

    readNotificationsKEY = "_noti";

    private localStoragePassword = "U^#@*SHDBY123P:)";

    constructor(
        private stdAuth: StudentAuthService,
        private ticketRep: TicketRepositoryService
    ) { }

    refreshUnreadTicketsCount() {
        this.ticketRep.getUnreadTicketsCount(this.stdAuth.getStudent().id, TicketType.StudentParent).subscribe(data => {
            if (data.success) {
                this.unReadTicketsCount = data.data;
            } else {
                this.stdAuth.auth.message.showMessageforFalseResult(data);
            }
        });
    }

    refreshLastWeekNotifications() {
        this.stdAuth.auth.post("/api/Notification/getAllLastWeek", NotificationShowType.StudentParent).subscribe(data => {
            if (data.success) {
                this.lastWeekNotifications = data.data;
            } else {
                this.stdAuth.auth.message.showMessageforFalseResult(data);
            }
        });
    }

    refreshTicketAndNotification() {
        this.refreshUnreadTicketsCount();
        this.refreshLastWeekNotifications();
    }

    getUnreadNotificationCount(): number {
        var count = 0;

        var readIds = this.getReadNotificationIds();

        this.lastWeekNotifications.forEach(noti => {
            var notiId = noti.id;

            if (!readIds.includes(notiId)) {
                count += 1;
            }
        });

        return count;
    }

    isAnyUnread(): boolean {
        if (this.unReadTicketsCount != 0 || this.getUnreadNotificationCount() != 0) {
            return true;
        }

        return false;
    }


    isNotificationContainsReads(id: number): boolean {
        var readIds = this.getReadNotificationIds();

        return readIds.includes(id);
    }


    setReadNotificationIds(ids: number[]) {
        let enc_Ids = cryptoJSON.encrypt({ i: ids }, this.localStoragePassword)
        localStorage.setItem(this.readNotificationsKEY, JSON.stringify(enc_Ids));
    }

    getReadNotificationIds(): number[] {
        var item = localStorage.getItem(this.readNotificationsKEY);

        if (item) {
            var res = cryptoJSON.decrypt(JSON.parse(item), this.localStoragePassword)

            var ids: number[] = res.i;

            return ids;
        }

        return [];
    }

    pushReadNotificationId(notiId: number) {
        var readIds = this.getReadNotificationIds();

        if (!readIds.includes(notiId)) {
            readIds.push(notiId);
        }

        this.setReadNotificationIds(readIds);
    }

    pushReadNotificationIds(notiIds: number[]) {
        notiIds.forEach(notiId => {
            this.pushReadNotificationId(notiId);
        });
    }

}
