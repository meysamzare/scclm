import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient, HttpHandler, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule, PreloadAllModules } from "@angular/router";

import { AppComponent } from "./app.component";
import { DashboardModule } from "./Dashboard/dashboard.module";
import { LoginComponent } from "./login/login.component";
import { NotfoundComponent } from "./shared/notfound.component";
import { SharedModule } from "./shared/shared.module";
import { MaterialModule } from "./shared/material.module";

import { NgxCaptchaModule } from "ngx-captcha";

import { NgProgressModule } from "@ngx-progressbar/core";
import { NgProgressHttpModule } from "@ngx-progressbar/http";
import { NgProgressRouterModule } from "@ngx-progressbar/router";
import {
    MatPaginatorIntl,
    DateAdapter,
    MatDatepickerIntl,
    MAT_DATE_LOCALE,
    MAT_DATE_FORMATS
} from "@angular/material";
import { MatPaginatorIntlCro } from "./shared/paginationInit";
import {
    MatDatePickerInit,
    MaterialPersianDateAdapter,
    PERSIAN_DATE_FORMATS
} from "./shared/persianDateInit";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { LoginGuardService } from "./shared/Guard/login-guard.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RegisterItemComponent } from "./register-item/register-item.component";
import { RegisterItemService } from "./register-item/register-item.service";
import { SignalRService } from "./shared/services/signalr.service";
import { IndexComponent } from "./index/index.component";
import { LogService } from "./shared/services/log.service";

import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { UpdateService } from "./shared/services/update.service";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { CanDeActiveRegisterItem } from "./register-item/candeactive-registeritem.service";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { RegisterItemCategoryService } from "./register-item/register-item-category.service";

import { FlexLayoutModule } from '@angular/flex-layout';

import { DpDatePickerModule } from 'ng2-jalali-date-picker';
import { LoginItemComponent } from "./login-item/login-item.component";
import { InfoItemComponent } from "./info-item/info-item.component";
import { InfoItemResolverService } from "./info-item/info-item-resolver.service";
import { OnReturnDirective } from "./shared/Directive/onreturn-directive.service";

import { ShowImageComponent } from "./shared/Modal/show-image.component";
import { LockScreenComponent } from "./Dashboard/lockscreen/lockscreen.component";
import { LockScreenGuardService } from "./shared/Guard/lockscreen-guard.service";


import { NotifierModule, NotifierOptions } from 'angular-notifier';

import { LoginStudentComponent } from "./login-student/login-student.component";
import { StudentWorkBookComponent } from "./student-workbook/student-workbook.component";
import { BootstrapModule } from "./shared/bootstrap/bootstrap.module";
import { CustomMessageComponent } from './shared/components/custom-message/custom-message.component';
import { LoginMessagesModule } from "./shared/components/login-messages/login-messages.module";
import { AuthService } from "./shared/Auth/auth.service";
import { CustomInterceptor } from "public/Services/http-interceptor/custom-Interceptor.service";
import { LoaderComponent } from './shared/components/loader/loader.component';

const customNotifierOptions: NotifierOptions = {
    position: {
        horizontal: {
            position: 'left',
            distance: 25
        },
        vertical: {
            position: 'bottom',
            distance: 12,
            gap: 10
        }
    },
    theme: 'material',
    behaviour: {
        autoHide: 4000,
        onClick: 'hide',
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4
    },
    animations: {
        enabled: true,
        show: {
            preset: 'slide',
            speed: 300,
            easing: 'ease'
        },
        hide: {
            preset: 'fade',
            speed: 300,
            easing: 'ease',
            offset: 50
        },
        shift: {
            speed: 300,
            easing: 'ease'
        },
        overlap: 150
    }
};

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NotfoundComponent,
        RegisterItemComponent,
        IndexComponent,
        LoginItemComponent,
        InfoItemComponent,
        OnReturnDirective,
        ShowImageComponent,
        LockScreenComponent,
        LoginStudentComponent,
        StudentWorkBookComponent,
        CustomMessageComponent,
        LoaderComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
        HttpClientModule,
        ServiceWorkerModule.register("ngsw-worker.js", {
            enabled: environment.production
        }),
        NotifierModule.withConfig(customNotifierOptions),
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
        RouterModule.forRoot(
            [
                { path: "", redirectTo: "/login", pathMatch: "full" },
                {
                    path: "login",
                    component: LoginComponent,
                    canActivate: [LoginGuardService]
                },
                {
                    path: "lockscreen",
                    component: LockScreenComponent,
                    canActivate: [LockScreenGuardService]
                },
                // {
                // 	path: "login-item/:catId/:type",
                // 	component: LoginItemComponent
                // },
                {
                    path: "login-student",
                    component: LoginStudentComponent
                },
                {
                    path: "student-workbook/:stdId",
                    component: StudentWorkBookComponent
                },
                // {
                // 	path: "item-info/:catId/:rahcode/:type",
                // 	component: InfoItemComponent,
                // 	resolve: {
                // 		item: InfoItemResolverService
                // 	}
                // },
                // {
                // 	path: "register-item/:id",
                // 	component: RegisterItemComponent,
                // 	resolve: {
                // 		attrs: RegisterItemService,
                // 		cat: RegisterItemCategoryService
                // 	},
                // 	canDeactivate: [CanDeActiveRegisterItem]
                // },
                { path: "**", component: NotfoundComponent, pathMatch: "full" }
            ],
            {
                useHash: true,
                scrollPositionRestoration: "enabled",
                preloadingStrategy: PreloadAllModules,
                initialNavigation: "enabled",
                // paramsInheritanceStrategy: 'always' 
            }
        ),
        DashboardModule,
        SharedModule,
        MaterialModule,
        BootstrapModule,
        NgbModule,
        NgxCaptchaModule,
        NgProgressModule,
        NgProgressHttpModule,
        NgProgressRouterModule,
        SweetAlert2Module,
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: "success",
            cancelText: "لغو",
            confirmText: "تایید",
            focusButton: "confirm",
            placement: "top",
            closeOnOutsideClick: true,
            popoverTitle: "آیا اطمینان دارید؟"
        }),
        FlexLayoutModule,
        NgxMaterialTimepickerModule,
        // OnlineStatusModule
        DpDatePickerModule,
        LoginMessagesModule
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
        LoginGuardService,
        RegisterItemService,
        RegisterItemCategoryService,
        SignalRService,
        LogService,
        UpdateService,
        CanDeActiveRegisterItem,
        InfoItemResolverService,
        LockScreenGuardService,
        CustomMessageComponent,
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        ShowImageComponent
    ]
})
export class AppModule { }


export function ConfigFactory(auth: AuthService, http: HttpClient) {
    return () => auth.load(http);
}