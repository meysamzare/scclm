import { Component, AfterViewInit, OnDestroy, OnInit } from "@angular/core";
import { AuthService, jsondata } from "../shared/Auth/auth.service";
import { MessageService } from "../shared/services/message.service";
import { ICategory } from "../Dashboard/category/category";
import { interval } from "rxjs";
import { LogService } from "../shared/services/log.service";
import { IDatePickerConfig } from "ng2-jalali-date-picker";

declare var $: any;

interface IWindow extends Window {
    WOW: any;
    signalR: any;
}

@Component({
    templateUrl: "./index.component.html",
    styles: [
        `
            div.di {
                pointer-events: none;
                opacity: 0.6;
            }
        `
    ]
})
export class IndexComponent implements AfterViewInit, OnDestroy, OnInit {
    categorys: ICategory[] = [];
    catData: ICategory[] = [];

    IsDateValid = true;

    serverDate = "";

    interval1;
    interval2;
    interval3;
    interval4;

    constructor(
        private auth: AuthService,
        private message: MessageService,
        private log: LogService
    ) {
        this.refreshCats();

        this.interval1 = interval(500).subscribe(x => {
            this.categorys = this.catData;
        });

        this.interval2 = interval(2000 * 60).subscribe(x => {
            this.refreshCats();
        });

        this.interval3 = interval(1000 * 60).subscribe(x => {
            this.checkDate();
        });

        this.interval4 = interval(500).subscribe(x => {
            var oldTime = oldTime || new Date();
            let newTime: any = new Date();
            let timeDiff = newTime - oldTime;

            oldTime = newTime;

            if (Math.abs(timeDiff) >= 5000) {
                // Five second leniency
                this.timeChanged(timeDiff);
            }
        });

        if (screen.width < 769) {
            $('body').toArray().forEach(body => {
                $(body).addClass('body-small');
            });
        } else {
            $('body').toArray().forEach(body => {
                $(body).removeClass('body-small');
            });
        }
    }

    timeChanged(x) {
        this.checkDate();
    }

    ngOnDestroy(): void {
        this.interval1.unsubscribe();
        this.interval2.unsubscribe();
        this.interval3.unsubscribe();
        this.interval4.unsubscribe();
    }

    refreshCats() {
        this.auth
            .post("/api/Category/GetAll", null)
            .subscribe((data: jsondata) => {
                if (data.success) {
                    this.catData = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            });
    }

    isValidToShow(cat: ICategory): boolean {
        if (cat.isActive) {
            var datePub: Date = new Date(Date.parse(cat.datePublish));
            var dateEx: Date = new Date(Date.parse(cat.dateExpire));
            var nowDate: Date = new Date();

            if (this.IsDateValid) {
                if (nowDate > datePub && nowDate < dateEx) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }

    isValidToShowForInfo(cat: ICategory): boolean {
        if (this.IsDateValid) {
            return cat.isInfoShow;
        }
    }

    isValidToShowForEntringCard(cat: ICategory): boolean {
        if (this.IsDateValid) {
            return cat.haveEntringCard;
        }
    }

    ngOnInit(): void {
        this.checkDate();
    }

    checkDate() {
        this.auth.post("/api/General/IsDateValid", new Date()).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.IsDateValid = true;
                    this.serverDate = data.message;
                } else {
                    this.IsDateValid = false;
                    this.serverDate = data.message;
                }
            }
        );

        return this.IsDateValid;
    }

    isLoginStdValid() {
        var nowDate = new Date();
        var eventDate = new Date("2019-06-23T07:00:00");

        return nowDate > eventDate;

    }

    ngAfterViewInit(): void {
        this.checkDate();
    }
}
