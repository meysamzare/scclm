import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main/main.component';
import { IndexComponent } from './index/index.component';
import { BootstrapModule } from 'src/app/shared/bootstrap/bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { ImageIconModule } from 'projects/ParentsMobileApp/src/app/shared/components/image-icon/image-icon/image-icon.module';
import { MenuComponent } from './menu/menu.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MoreComponent } from './more/more.component';
import { ToolbarItemCenterDirective, ToolbarItemRightDirective, ToolbarItemLeftDirective } from './toolbar/toolbar.directive';
import { TicketsComponent } from './tickets/tickets.component';
import { ChatsComponent } from './chats/chats.component';
import { ChangePasswordComponent } from './more/change-password/change-password.component';
import { SettingsComponent } from './more/settings/settings.component';
import { ViewTicketComponent } from './tickets/view-ticket/view-ticket.component';
import { ViewChatComponent } from './chats/view-chat/view-chat.component';
import { ClassBookComponent } from './class-book/class-book.component';
import { LongpressDirective } from 'projects/ParentsMobileApp/src/app/shared/directives/longpress.directive';
import { ViewStudentComponent } from './class-book/view-student/view-student.component';
import { SetClassBookComponent } from './class-book/set-class-book/set-class-book.component';
import { BrowserModule } from '@angular/platform-browser';
import { TeacherCategoryListComponent } from './more/teacher-category-list/teacher-category-list.component';
import { CategoryDataListComponent } from './more/teacher-category-list/category-data-list/category-data-list.component';
import { ViewItemDataComponent } from './more/teacher-category-list/category-data-list/view-item-data/view-item-data.component';
import { HtmlToolsModule } from 'src/app/html-tools/html-tools.module';
import { SetItemAttributeScoreComponent } from 'src/app/Dashboard/item/list/set-item-attribute-score/set-item-attribute-score.component';
import { ShowImageComponent } from 'src/app/shared/Modal/show-image.component';


@NgModule({
    declarations: [
        MainComponent,
        IndexComponent,
        MenuComponent,
        ToolbarComponent,
        ToolbarItemLeftDirective,
        ToolbarItemRightDirective,
        ToolbarItemCenterDirective,
        MoreComponent,
        TicketsComponent,
        ChatsComponent,
        ChangePasswordComponent,
        SettingsComponent,
        ViewTicketComponent,
        ViewChatComponent,
        ClassBookComponent,
        LongpressDirective,
        ViewStudentComponent,
        SetClassBookComponent,
        TeacherCategoryListComponent,
        CategoryDataListComponent,
        ViewItemDataComponent,
        SetItemAttributeScoreComponent,
        ShowImageComponent
    ],
    imports: [
        CommonModule,
        MainRoutingModule,
        BootstrapModule,
        FormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        BrowserModule,
        FlexLayoutModule,
        HttpClientModule,
        ChartsModule,
        ReactiveFormsModule,
        ImageIconModule,
        HtmlToolsModule
    ],
    entryComponents: [
        SetItemAttributeScoreComponent,
        ShowImageComponent
    ],
    exports: [
        BootstrapModule,
    ]
})
export class MainModule { }
