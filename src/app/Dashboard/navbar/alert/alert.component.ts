import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/Auth/auth.service";
import { SignalRService } from "src/app/shared/services/signalr.service";
import { ChatService, INewMessage } from "src/app/shared/services/chat.service";
import { interval } from "rxjs/internal/observable/interval";

@Component({
    selector: "app-alert",
    templateUrl: "./alert.component.html"
})
export class AlertComponent implements OnDestroy {

    interval1;
    intervalUnReadMessages;

    remainTime;

    firstTituteName = "....";

    draftCount = 0;
    draftCountInterval;

    constructor(
        private router: Router,
        public auth: AuthService,
        private signalr: SignalRService,
        public chat: ChatService
    ) {
        this.interval1 = interval(500).subscribe(x => {
            this.remainTime = this.getExpTimeRemain();
        });

        // Refresh UnReadMessages every 45 sec
        this.intervalUnReadMessages = interval(45000).subscribe(c => {
            this.chat.getUnReadMessages();
        });

        this.chat.getUnReadMessages();

        this.auth.post("/api/Dashboard/getFirstTituteName").subscribe(data => {
            if (data.success) {
                this.firstTituteName = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
        
        this.auth.draft.getCount().then(count => {
            this.draftCount = count;
        });

        this.draftCountInterval = interval(1000 * 20).subscribe(async () => {
            this.draftCount = await this.auth.draft.getCount();
        });
    }

    async clearDrafts() {
        if (await this.auth.draft.clearAllDrafts()) {
            this.auth.message.showSuccessAlert("پیش نویس ها با موفقیت حذف شدند");
            this.draftCount = 0;
        } else {
            this.auth.message.showErrorAlert("خطایی در حذف پیش نویس ها روی داده است");
        }
    }

    ngOnDestroy(): void {
        this.interval1.unsubscribe();
        this.intervalUnReadMessages.unsubscribe();
        this.draftCountInterval.unsubscribe();
    }

    Logout() {
        this.signalr.stopConnectionUser();
        this.auth.Logout();
    }

    getConnectionColor() {
        var state = this.getConnectionState();

        if (state == 0) {
            return "darkorange";
        }
        if (state == 1) {
            return "white";
        }
        if (state == 2) {
            return "darkorange";
        }
        if (state == 4) {
            return "red";
        }


        return "black";
    }

    getExpTimeRemain() {
        var expDate = this.auth.getTokenExpirationDate();
        var nowDate = new Date();

        var remainMinuts = expDate.getTime() - nowDate.getTime();

        if (remainMinuts < 0) {

            this.auth.redirectUrl = this.router.url;
            this.signalr.stopConnectionUser();
            this.auth.lockUser();
        }

        return this.msToTime(remainMinuts);
    }
    msToTime(duration: number) {
        // var milliseconds = ((duration % 1000) / 100);
        var seconds: any = Math.floor((duration / 1000) % 60);
        var minutes: any = Math.floor((duration / (1000 * 60)) % 60);
        // var hours: any = Math.floor((duration / (1000 * 60 * 60)) % 24);

        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return minutes + ":" + seconds;
    }

    getConnectionState() {
        var state = this.signalr.getChatHubState();

        return state;
    }

    refreshConnection() {
        this.signalr.startConnection();
    }

    getConnectionString() {
        var state = this.getConnectionState();

        if (state == 0) {
            return "خطایی در اتصال با سوکت به وجود آمده است در حال تلاش مجدد";
        }
        if (state == 1) {
            return "متصل به سوکت";
        }
        if (state == 2) {
            return "در حال اتصال به سوکت";
        }
        if (state == 4) {
            return "اتصال با سوکت با مشکل مواجه شده است";
        }

        return "";
    }
}
