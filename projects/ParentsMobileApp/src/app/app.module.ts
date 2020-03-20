import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainModule } from './main/main.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { MaterialModule } from 'src/app/shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorIntl, MatDatepickerIntl, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MatPaginatorIntlCro } from 'src/app/shared/paginationInit';
import { MatDatePickerInit, MaterialPersianDateAdapter, PERSIAN_DATE_FORMATS } from 'src/app/shared/persianDateInit';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { MobileMessageComponent } from './shared/components/mobile-message/mobile-message.component';
import { LoginComponent } from './shared/components/login/login.component';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { NgProgressRouterModule } from '@ngx-progressbar/router';
import { LongpressDirective } from './shared/directives/longpress.directive';
import { ImageIconComponent } from './shared/components/image-icon/image-icon.component';
import { ImageIconModule } from './shared/components/image-icon/image-icon/image-icon.module';
import { LoginMessagesModule } from 'src/app/shared/components/login-messages/login-messages.module';
import { CustomInterceptor } from 'public/Services/http-interceptor/custom-Interceptor.service';
import { LoaderComponent } from './shared/components/loader/loader.component';

@NgModule({
    declarations: [
        AppComponent,
        NotFoundComponent,
        MobileMessageComponent,
        LoginComponent,
        LongpressDirective,
        LoaderComponent
    ],
    imports: [
        BrowserModule,
        MainModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        OverlayModule,
        MaterialModule,
        FlexLayoutModule,
        HttpClientModule,
        FormsModule,
        NgProgressModule,
        ImageIconModule,
        LoginMessagesModule
		// NgProgressHttpModule,
		// NgProgressRouterModule,
        // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro },
        { provide: MatDatepickerIntl, useClass: MatDatePickerInit },
        {
            provide: DateAdapter,
            useClass: MaterialPersianDateAdapter,
            deps: [MAT_DATE_LOCALE]
        },
        { provide: MAT_DATE_FORMATS, useValue: PERSIAN_DATE_FORMATS },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        AuthService,
        {
            provide: APP_INITIALIZER,
            useFactory: ConfigFactory,
            multi: true,
            deps: [AuthService, HttpClient]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CustomInterceptor,
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }


export function ConfigFactory(config: AuthService, http: HttpClient) {
    return () => config.load(http);
}