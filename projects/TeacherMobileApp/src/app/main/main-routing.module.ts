import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { IndexComponent } from './index/index.component';
import { MoreComponent } from './more/more.component';
import { MainGuard } from '../shared/guards/main.guard';
import { ChangePasswordComponent } from './more/change-password/change-password.component';
import { TicketsComponent } from './tickets/tickets.component';
import { ChatsComponent } from './chats/chats.component';
import { SettingsComponent } from './more/settings/settings.component';
import { ViewTicketComponent } from './tickets/view-ticket/view-ticket.component';
import { ClassBookComponent } from './class-book/class-book.component';
import { ViewChatComponent } from './chats/view-chat/view-chat.component';
import { ViewChatRepositoryService } from './chats/view-chat/view-chat-repository.service';
import { SetClassBookComponent } from './class-book/set-class-book/set-class-book.component';
import { ViewStudentComponent } from './class-book/view-student/view-student.component';
import { TeacherCategoryListComponent } from './more/teacher-category-list/teacher-category-list.component';
import { CategoryDataListComponent } from './more/teacher-category-list/category-data-list/category-data-list.component';
import { ViewItemDataComponent } from './more/teacher-category-list/category-data-list/view-item-data/view-item-data.component';


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
                path: "class-book",
                children: [
                    {
                        path: "",
                        pathMatch: "full",
                        component: ClassBookComponent
                    },
                    {
                        path: "set-class-book",
                        component: SetClassBookComponent
                    },
                    {
                        path: "view-student/:id",
                        component: ViewStudentComponent
                    }
                ]
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
                path: "chats",
                children: [
                    {
                        path: "",
                        pathMatch: "full",
                        component: ChatsComponent
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
                        component: ChangePasswordComponent
                    },
                    {
                        path: "settings",
                        component: SettingsComponent
                    },
                    {
                        path: "category",
                        children: [
                            {
                                path: "",
                                pathMatch: "full",
                                component: TeacherCategoryListComponent
                            },
                            {
                                path: "data/:catId/:Type/:catTitle",
                                component: CategoryDataListComponent
                            },
                            {
                                path: "view-item/:itemId/:catId/:itemTitle",
                                component: ViewItemDataComponent
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ViewChatRepositoryService]
})
export class MainRoutingModule { }
