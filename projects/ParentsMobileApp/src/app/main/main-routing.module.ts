import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { IndexComponent } from './index/index.component';
import { MoreComponent } from './more/more.component';
import { MainGuard } from '../shared/guards/main.guard';
import { ChanagePasswordComponent } from './more/chanage-password/chanage-password.component';
import { WorkBookComponent } from './work-book/work-book.component';
import { TicketsComponent } from './more/tickets/tickets.component';
import { ViewTicketComponent } from './more/tickets/view-ticket/view-ticket.component';
import { SettingsComponent } from './more/settings/settings.component';
import { NotificationsComponent } from './more/notifications/notifications.component';
import { ComplateStudentInfoComponent } from './complate-student-info/complate-student-info.component';
import { ChatComponent } from './chat/chat.component';
import { ViewChatComponent } from './chat/view-chat/view-chat.component';
import { ViewChatRepositoryService } from './chat/view-chat/view-chat-repository.service';
import { ViewCatDetailComponent } from './view-cat-detail/view-cat-detail.component';
import { AddStudentDailySchduleComponent } from './work-book/student-daily-schdule/add-student-daily-schdule/add-student-daily-schdule.component';
import { StudentDailyScheduleDetailComponent } from './work-book/student-daily-schdule/student-daily-schedule-detail/student-daily-schedule-detail.component';


const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        canActivateChild: [MainGuard],
        children: [
            {
                path: "",
                pathMatch: "full",
                component: IndexComponent
            },
            {
                path: "work-book",
                component: WorkBookComponent
            },
            {
                path: "student-daily-schedule",
                children: [
                    {
                        path: "add/:stdClassMngId/:gradeId",
                        component: AddStudentDailySchduleComponent
                    },
                    {
                        path: "view/:id",
                        component: StudentDailyScheduleDetailComponent
                    }
                ]
            },
            {
                path: "view-cat-detail/:catId/:itemId/:catName",
                component: ViewCatDetailComponent
            },
            {
                path: "chat",
                children: [
                    {
                        path: "",
                        pathMatch: "full",
                        component: ChatComponent
                    },
                    {
                        path: "view/:Cid/:Ctype/:name",
                        component: ViewChatComponent,
                        resolve: {
                            chats: ViewChatRepositoryService
                        }
                    }
                ]
            },
            {
                path: "more",
                children: [
                    {
                        path: "",
                        pathMatch: "full",
                        component: MoreComponent
                    },
                    {
                        path: "change-password",
                        component: ChanagePasswordComponent
                    },
                    {
                        path: "tickets",
                        children: [
                            {
                                path: "",
                                pathMatch: "full",
                                component: TicketsComponent
                            },
                            {
                                path: "view/:id",
                                component: ViewTicketComponent
                            }
                        ]
                    },
                    {
                        path: "settings",
                        component: SettingsComponent
                    },
                    {
                        path: "notifications",
                        component: NotificationsComponent
                    }
                ]
            },
            {
                path: "complate-student-info",
                component: ComplateStudentInfoComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRoutingModule { }
