import { Component, OnInit } from '@angular/core';
import { MainServiceWorkerService } from '../../service/main-service-worker.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { ThemeService } from '../../service/theme.service';
import { StudentAuthService } from '../../service/parent-student-auth.service';
import { IExam } from 'src/app/Dashboard/Exam/exam/exam';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

    upComingExams: IExam[] = [];

    isNewUpdateAvalable = false;

    sumOfStudentScore = "---";

    constructor(
        private mainSW: MainServiceWorkerService,
        public message: MessageService,
        private theme: ThemeService,
        public stdAuth: StudentAuthService
    ) {
        this.theme.setCurrentTheme();


        this.mainSW.Install();

        this.mainSW.newUpdateAvailable$.subscribe(data => {
            this.isNewUpdateAvalable = true;

            this.mainSW.showNotification("نسخه جدید موجود است!", "نسخه جدیدی از نرم افزار موجود است برای بروز رسانی کلیک کنید", "update");
        });
    }

    async ngOnInit() {

        const studentId = this.stdAuth.getStudent().id;

        this.refreshUpComingExams();

        this.stdAuth.auth.post("/api/StudentScore/getSumOfStudentScore", studentId).subscribe(data => {
            if (data.success) {
                this.sumOfStudentScore = data.data || 0;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.stdAuth.auth.handlerError(er);
        });
    }

    subscribeToServer() {
        this.mainSW.subscribe();
    }

    unsubscribeToServer() {
        this.mainSW.unsubscribe();
    }

    refreshUpComingExams() {
        var activeStdClassMng = this.stdAuth.getActiveStdClassMng();
        if (activeStdClassMng) {
            this.stdAuth.auth.post("/api/Exam/getUpComingExamInWeek", activeStdClassMng.classId).subscribe(data => {
                if (data.success) {
                    this.upComingExams = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.stdAuth.auth.handlerError(er);
            });

            return;
        }

        this.upComingExams = [];
    }

    sendDataToServer() {
        this.mainSW.sendBrodcastToServer("سلام من یک پیام از طرف سرور هستم", "سلام", "google.com");
        navigator.serviceWorker.getRegistration().then(function (reg) {
            var options: NotificationOptions = {
                body: 'Here is a notification body!',
                icon: 'assets/icons/icon-72x72.png',

                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 1
                },
                actions: [
                    {
                        action: 'explore', title: 'Explore this new world',
                        icon: 'assets/icons/icon-72x72.png'
                    },
                    {
                        action: 'close', title: 'Close notification',
                        icon: 'assets/icons/icon-72x72.png'
                    },
                ],
                dir: "rtl",
                image: "assets/icons/icon-512x512.png",
                lang: "fa"
            };
            reg.showNotification('Hello world!', options);
        });
    }


    reload() {
        document.location.reload();
    }
}
