import { Component, OnInit, Output } from '@angular/core';
import { IBestStudent } from 'src/app/Dashboard/WebSiteManagment/best-student/best-student';
import { AuthService } from 'src/app/shared/Auth/auth.service';

declare var $: any;

@Component({
    selector: 'app-best-in-week',
    templateUrl: './best-in-week.component.html',
    styleUrls: ['./best-in-week.component.scss']
})
export class BestInWeekComponent implements OnInit {

    
    bestStudents: IBestStudent[] = [];


    constructor(
        public auth: AuthService
    ) { }

    owlOption = {
        rtl: true,
        items: 1,
        autoplay: true,
        autoplayTimeout: 5000,
        loop: true,
        dots: false,
        onInitialized: this.startProgressBar,
        onTranslate: this.resetProgressBar,
        onTranslated: this.startProgressBar
    }

    isAnyBestStudent(): boolean {
        return this.bestStudents.length == 0 ? false : true;
    }


    startProgressBar() {
        // apply keyframe animation
        $(".slide-progress").css({
            width: "100%",
            transition: "width 5000ms"
        });
    }

    resetProgressBar() {
        $(".slide-progress").css({
            width: 0,
            transition: "width 0s"
        });
    }

    ngOnInit() {
        this.auth.post("/api/BestStudent/getAllByDate").subscribe(data => {
            if (data.success) {
                this.bestStudents = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

}
