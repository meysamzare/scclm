import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { IOnlineClass } from 'src/app/Dashboard/OnlineClass/online-class';
import { BigBlueButtonRepositoryService, JoinParam } from 'public/Services/big-blue-button/big-blue-button-repository.service';
import { interval } from 'rxjs';
import { AuthService } from 'src/app/shared/Auth/auth.service';

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
    @Input() userName = "";

    isClassRunning = false;

    refreshInterval = null;

    @Output() classStateUpdate = new EventEmitter<any>();

    constructor(
        private auth: AuthService,
        private bbbRepo: BigBlueButtonRepositoryService
    ) { }


    ngOnDestroy() {
        if (this.refreshInterval) {
            this.refreshInterval.unsubscribe();
        }
    }

    ngOnInit() {
        this.refreshInterval = interval(20 * 1000).subscribe(async () => {
            if (!this.isAdmin) {
                await this.refreshIsRunning();
            }
        });
    }

    async refreshIsRunning() {
        const isRunning = await this.bbbRepo.isMeetingRunning(this.onlineClass.meetingId);
        this.isClassRunning = isRunning;
        this.classStateUpdate.emit(this.onlineClass);
    }

    canOpenClass(): boolean {
        if (this.isAdmin) {
            return true;
        }

        return this.isClassRunning && !this.isLoading;
    }

    isLoading = false;

    async openBBBClass() {
        if (this.canOpenClass()) {
            this.isLoading = true;
            try {
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

                const joinObject: JoinParam = {
                    fullName: this.bbbRepo.getStringPrecentEncoding(this.userFullName),
                    meetingID: this.onlineClass.meetingId,
                    password: this.isAdmin ? this.onlineClass.moderatorPW : this.onlineClass.attendeePW,
                    joinViaHtml5: true,
                    userID: `${this.isAdmin ? 'AdTMA_' : 'StPMA_'}${this.userId}`
                };

                const joinResult = await this.bbbRepo.join(joinObject, true);


                this.auth.post("/api/OnlineClass/setLogin", {
                    meetingId: this.onlineClass.meetingId,
                    fullName: this.userFullName,
                    userName: this.userName,
                    userId: +this.userId,
                    agentType: this.isAdmin ? 1 : 2,
                }).subscribe();

                this.auth.logToServer({
                    type: 'View',
                    agentId: +this.userId,
                    agentType: this.isAdmin ? 'Teacher' : "StudentParent",
                    agentName: this.userFullName,
                    tableName: "Send Join Request From TMA/PMA For OnlineClass: " + this.onlineClass.className,
                    logSource: 'dashboard',
                    object: { joinObject, joinResult },
                    oldObject: null,
                    table: "OnlineClass",
                    tableObjectIds: [this.onlineClass.meetingId]
                });

            } catch {
                this.auth.message.showErrorAlert("خطایی روی داده است، لطفا مجددا تلاش فرمایید");
            }
            this.isLoading = false;
        }
    }

}
