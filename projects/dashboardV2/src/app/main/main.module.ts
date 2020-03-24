import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { MainComponent } from './main/main.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IndexComponent } from './index/index.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ReusableComponentModule } from '../shared/reusable-component/reusable-component.module';

import { Angular2BulmaModule } from 'angular2-bulma';
import { TestComponent } from './test/test.component';
import { SidebarUserInfoComponent } from './sidebar/sidebar-user-info/sidebar-user-info.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
    declarations: [
        MainComponent,
        IndexComponent,
        SidebarComponent,
        TestComponent,
        SidebarUserInfoComponent
    ],
    imports: [
        CommonModule,
        MainRoutingModule,
        FormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        ReusableComponentModule,
        Angular2BulmaModule,
        PerfectScrollbarModule
    ]
})
export class MainModule { }
