import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IOnlineClass } from 'src/app/Dashboard/OnlineClass/online-class';
import { BigBlueButtonRepositoryService } from 'public/Services/big-blue-button/big-blue-button-repository.service';
import { interval } from 'rxjs';

var native2ascii = require("node-native2ascii");

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

    isClassRunning = false;

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
        this.refreshInterval = interval(10000).subscribe(async () => {
            if (!this.isAdmin) {
                await this.refreshIsRunning();
            }
        });
    }

    async refreshIsRunning() {
        const isRunning = await this.bbbRepo.isMeetingRunning(this.onlineClass.meetingId);
        this.isClassRunning = isRunning;
    }

    canOpenClass(): boolean {
        if (this.isAdmin) {
            return true;
        }

        return this.isClassRunning;
    }

    async openBBBClass() {
        if (this.canOpenClass()) {
            if (this.isAdmin) {
                await this.bbbRepo.create({
                    name: this.bbbRepo.getStringPrecentEncoding(this.onlineClass.name),
                    meetingID: this.onlineClass.meetingId,
                    attendeePW: this.onlineClass.attendeePW,
                    moderatorPW: this.onlineClass.moderatorPW,
                    welcome: this.bbbRepo.getStringPrecentEncoding(this.onlineClass.welcome),
                    maxParticipants: this.onlineClass.maxParticipants,
                    record: this.onlineClass.record,
                    duration: this.onlineClass.duration,
                    isBreakout: this.onlineClass.isBreakout,
                    parentMeetingID: this.onlineClass.parentMeetingID,
                    sequence: this.onlineClass.sequence,
                    autoStartRecording: this.onlineClass.autoStartRecording,
                    allowStartStopRecording: this.onlineClass.allowStartStopRecording,
                    muteOnStart: this.onlineClass.muteOnStart,
                    allowModsToUnmuteUsers: this.onlineClass.allowModsToUnmuteUsers,
                    lockSettingsDisableCam: this.onlineClass.lockSettingsDisableCam,
                    lockSettingsDisablePrivateChat: this.onlineClass.lockSettingsDisablePrivateChat,
                    lockSettingsDisablePublicChat: this.onlineClass.lockSettingsDisablePublicChat,
                    lockSettingsDisableNote: this.onlineClass.lockSettingsDisableNote,
                });
            }

            await this.bbbRepo.join({
                fullName: this.bbbRepo.getStringPrecentEncoding(this.userFullName),
                meetingID: this.onlineClass.meetingId,
                password: this.isAdmin ? this.onlineClass.moderatorPW : this.onlineClass.attendeePW,
                joinViaHtml5: true,
                userID: `${this.isAdmin ? 'AdTMA_' : 'StPMA_'}${this.userId}`
            }, true);
        }
    }

}
