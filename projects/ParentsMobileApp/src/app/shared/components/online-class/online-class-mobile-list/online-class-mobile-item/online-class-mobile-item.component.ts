import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IOnlineClass } from 'src/app/Dashboard/OnlineClass/online-class';
import { BigBlueButtonRepositoryService } from 'public/Services/big-blue-button/big-blue-button-repository.service';
import { interval } from 'rxjs';

@Component({
    selector: 'app-online-class-mobile-item',
    templateUrl: './online-class-mobile-item.component.html',
    styleUrls: ['./online-class-mobile-item.component.scss']
})
export class OnlineClassMobileItemComponent implements OnInit, OnDestroy {

    @Input() onlineClass: IOnlineClass = new IOnlineClass();
    @Input() isAdmin = false;
    @Input() userFullName = "";
    @Input() userId = "";

    isRunning = false;

    refreshInterval = null;

    constructor(
        private bbbRepo: BigBlueButtonRepositoryService
    ) { }


    ngOnDestroy() {
        if (this.refreshInterval) {
            this.refreshInterval.unsubscribe();
        }
    }

    ngOnInit() {
        this.refreshInterval = interval(10000).subscribe(() => {
            if (!this.isAdmin) {
                this.refreshIsRunning();
            }
        });
    }

    async refreshIsRunning() {
        this.isRunning = await this.bbbRepo.isMeetingRunning(this.onlineClass.meetingId);
    }

    openBBBClass() {
        this.bbbRepo.join({
            fullName: this.userFullName,
            meetingID: this.onlineClass.meetingId,
            password: this.isAdmin ? this.onlineClass.moderatorPW : this.onlineClass.attendeePW,
            joinViaHtml5: true,
            userID: `${this.isAdmin ? 'AD' : ''}${this.userId}`
        }, true);
    }

}
