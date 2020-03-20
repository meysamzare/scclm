import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResponsiveHeaderComponent } from './index/responsive-header/responsive-header.component';
import { HeaderComponent } from './index/header/header.component';
import { FooterComponent } from './index/footer/footer.component';
import { IndexComponent } from './index/index.component';
import { FeedComponent } from './index/feed/feed.component';
import { BestInWeekComponent } from './index/best-in-week/best-in-week.component';
import { SliderComponent } from './index/slider/slider.component';
import { AmazingSliderComponent } from './index/amazing-slider/amazing-slider.component';
import { LastInFadakComponent } from './index/last-in-fadak/last-in-fadak.component';
import { LastInSiteComponent } from './index/last-in-site/last-in-site.component';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BootstrapModule } from 'src/app/shared/bootstrap/bootstrap.module';
import { LastFeedComponent } from './index/last-feed/last-feed.component';

import { CountdownTimerModule } from 'ngx-countdown-timer';
import { OwlModule } from 'ngx-owl-carousel';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { RegisterItemService } from 'src/app/register-item/register-item.service';
import { RegisterItemCategoryService } from 'src/app/register-item/register-item-category.service';
import { CanDeActiveRegisterItem } from 'src/app/register-item/candeactive-registeritem.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorIntl, MatDatepickerIntl, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MatPaginatorIntlCro } from 'src/app/shared/paginationInit';
import { MatDatePickerInit, MaterialPersianDateAdapter, PERSIAN_DATE_FORMATS } from 'src/app/shared/persianDateInit';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { LoginItemComponent } from './login-item/login-item.component';
import { InfoItemComponent } from './login-item/info-item/info-item.component';
import { InfoItemResolverService } from 'src/app/info-item/info-item-resolver.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { NgProgressRouterModule } from '@ngx-progressbar/router';
import { MainIndexComponent } from './index/main-index/main-index.component';
import { IndexModule } from './index/index.module';
import { RegisterItemCatComponent } from './register-item/register-item.component';
import { RegisterItemComponent } from 'src/app/register-item/register-item.component';
import { CustomMessageComponent } from 'src/app/shared/components/custom-message/custom-message.component';
import { CopyClipboardDirective } from './shared/copy-clipboard.directive';
import { AdvertisingComponent } from './index/advertising/advertising.component';
import { ImageIconModule } from 'projects/ParentsMobileApp/src/app/shared/components/image-icon/image-icon/image-icon.module';
import { RouterModule } from '@angular/router';
import { LoginForRegisterItemComponent } from './register-item/login-for-register-item/login-for-register-item.component';
import { LicenseForRegisterItemComponent } from './register-item/license-for-register-item/license-for-register-item.component';
import { CustomInterceptor } from 'public/Services/http-interceptor/custom-Interceptor.service';


@NgModule({
    declarations: [
        AppComponent,
        ResponsiveHeaderComponent,
        HeaderComponent,
        FooterComponent,
        IndexComponent,
        FeedComponent,
        BestInWeekComponent,
        SliderComponent,
        AmazingSliderComponent,
        LastInFadakComponent,
        LastInSiteComponent,
        LastFeedComponent,
        NotFoundComponent,
        RegisterItemCatComponent,
        LoginItemComponent,
        InfoItemComponent,
        MainIndexComponent,
        RegisterItemComponent,
        CustomMessageComponent,
        AdvertisingComponent,
        LoginForRegisterItemComponent,
        LicenseForRegisterItemComponent
    ],
    imports: [
        IndexModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BootstrapModule,
        CountdownTimerModule.forRoot(),
        OwlModule,
        FormsModule,
        ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
        MaterialModule,
        SweetAlert2Module,
        BrowserAnimationsModule,
        NgbModule,
        NgxCaptchaModule,
        NgProgressModule,
        NgProgressHttpModule,
        NgProgressRouterModule,
        ImageIconModule,
        RouterModule
    ],
    providers: [
        AuthService,
        {
            provide: APP_INITIALIZER,
            useFactory: ConfigFactory,
            multi: true,
            deps: [AuthService, HttpClient]
        },
        { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro },
        { provide: MatDatepickerIntl, useClass: MatDatePickerInit },
        {
            provide: DateAdapter,
            useClass: MaterialPersianDateAdapter,
            deps: [MAT_DATE_LOCALE]
        },
        { provide: MAT_DATE_FORMATS, useValue: PERSIAN_DATE_FORMATS },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        InfoItemResolverService,
        RegisterItemService,
        RegisterItemCategoryService,
        CanDeActiveRegisterItem,
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