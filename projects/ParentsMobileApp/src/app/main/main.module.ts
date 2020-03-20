import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main/main.component';
import { IndexComponent } from './index/index.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { BootstrapModule } from 'src/app/shared/bootstrap/bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MenuComponent } from './menu/menu.component';
import { HttpClientModule } from '@angular/common/http';
import { MoreComponent } from './more/more.component';
import { ChanagePasswordComponent } from './more/chanage-password/chanage-password.component';
import { WorkBookComponent } from './work-book/work-book.component';
import { ChartsModule } from 'ng2-charts';
import { ToolbarItemCenterDirective, ToolbarItemRightDirective, ToolbarItemLeftDirective } from './toolbar/toolbar-item.directive';
import { TicketsComponent } from './more/tickets/tickets.component';
import { ViewTicketComponent } from './more/tickets/view-ticket/view-ticket.component';
import { SettingsComponent } from './more/settings/settings.component';
import { NotificationsComponent } from './more/notifications/notifications.component';
import { ComplateStudentInfoComponent } from './complate-student-info/complate-student-info.component';
import { ImageIconModule } from '../shared/components/image-icon/image-icon/image-icon.module';
import { ChatComponent } from './chat/chat.component';
import { ViewChatComponent } from './chat/view-chat/view-chat.component';
import { PostMobileViewModule } from '../shared/components/post-mobile-view/post-mobile-view.module';
import { NgSwitcheryModule } from 'angular-switchery-ios';
import { SelectChatReciverDialogComponent } from './chat/select-chat-reciver-dialog/select-chat-reciver-dialog.component';

@NgModule({
    declarations: [
        MainComponent,
        IndexComponent,
        ToolbarComponent,
        MenuComponent,
        MoreComponent,
        ChanagePasswordComponent,
        WorkBookComponent,
        ToolbarItemLeftDirective,
        ToolbarItemCenterDirective,
        ToolbarItemRightDirective,
        TicketsComponent,
        ViewTicketComponent,
        SettingsComponent,
        NotificationsComponent,
        ComplateStudentInfoComponent,
        ChatComponent,
        ViewChatComponent,
        SelectChatReciverDialogComponent
    ],
    imports: [
        CommonModule,
        MainRoutingModule,
        BootstrapModule,
        FormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        HttpClientModule,
        ChartsModule,
        ReactiveFormsModule,
        ImageIconModule,
        PostMobileViewModule,
        NgSwitcheryModule
    ],
    entryComponents: [
        SelectChatReciverDialogComponent
    ]
})
export class MainModule { }
