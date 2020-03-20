import { Component, AfterViewInit, HostListener, OnInit } from '@angular/core';
import {
    Router,
    Event,
    NavigationCancel,
    NavigationStart,
    NavigationEnd,
    NavigationError,
    RouterLinkActive
} from '@angular/router';
import { AuthService, jsondata } from './shared/Auth/auth.service';
import { MessageService } from './shared/services/message.service';
import { UpdateService } from './shared/services/update.service';
import { SwUpdate } from '@angular/service-worker';
import { startWith, delay, tap, debounceTime } from 'rxjs/operators';
import { NgSelectConfig } from '@ng-select/ng-select';
import { LoaderService } from 'public/Services/http-interceptor/loader.service';
import { MatSnackBar } from '@angular/material';

// import { OnlineStatusService, OnlineStatusType } from "ngx-online-status";

declare var $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [RouterLinkActive]
})
export class AppComponent implements AfterViewInit, OnInit {
    ngOnInit(): void {
        // var stream = navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    }

    isLoading = true;

    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];

    constructor(
        private route: Router,
        private roterActive: RouterLinkActive,
        private auth: AuthService,
        private message: MessageService,
		private update: UpdateService,
        private selectconfig: NgSelectConfig,
        // private onlineStatusService: OnlineStatusService
    ) {

        this.update.checkForUpdates();


        $(document).on("wheel", "input[type=number]", function (e) {
            $(this).blur();
		});
		
		this.selectconfig.notFoundText = "موردی یافت نشد";
		this.selectconfig.clearAllText = "حذف";
		this.selectconfig.loadingText = "در حال بارگذاری";
		this.selectconfig.placeholder = "موردی را جستجو و انتخاب نمایید";

        roterActive.routerLinkActiveOptions.exact = true;

        // onlineStatusService.status.subscribe((status: OnlineStatusType) => {})
    }
    ngAfterViewInit(): void {
        $('#side-menu').metisMenu({
            toggle: true
        });


        this.route.events.subscribe((ev) => {
            this.checkRouterEvent(ev);

            $(function (e) {
                if ($("#divtree").length != 0) {
                    $('#divtree').on('ready.jstree', function() {
                        $("#divtree").jstree("open_all");          
                    });
                }
            });
        })

        this.route.events.pipe(
            debounceTime(1000),
            startWith(null),
            delay(0),
            tap((ev: Event) => {

                if (this.auth.isUserLoggedinGuard()) {
                    this.auth.post("/api/User/LoginA", this.auth.getUser().username)
                        .subscribe((data: jsondata) => {
                            if (data.success) {
                                this.auth.setToken(data.message);
                            }
                        })
                }
                
            })
        ).subscribe();
    }


    @HostListener("document:keydown.shift.c")
    clearToast() {
        this.message.clearAll();
    }

    checkRouterEvent(routerEvent: Event) {
        if (routerEvent instanceof NavigationStart) {
            this.isLoading = true;
        }

        if (
            routerEvent instanceof NavigationEnd ||
            routerEvent instanceof NavigationCancel ||
            routerEvent instanceof NavigationError
        ) {
            this.isLoading = false;
        }
    }
}
