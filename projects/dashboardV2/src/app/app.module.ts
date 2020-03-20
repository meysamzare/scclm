import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainModule } from './main/main.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { Angular2BulmaModule } from 'angular2-bulma';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { ConfigFactory } from 'src/app/app.module';
import { LoginComponent } from './login/login.component';
import { ReusableComponentModule } from './shared/reusable-component/reusable-component.module';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        MainModule,
        AppRoutingModule,
        MaterialModule,
        Angular2BulmaModule,
        HttpClientModule,
        ReusableComponentModule,
        FormsModule,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: ConfigFactory,
            multi: true,
            deps: [AuthService, HttpClient]
        },
    ],
    bootstrap: [AppComponent],
    exports: []
})
export class AppModule { }
