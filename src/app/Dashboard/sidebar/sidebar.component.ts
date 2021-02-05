import { Component, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/Auth/auth.service";
import { SignalRService } from "src/app/shared/services/signalr.service";

declare var $: any;

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styles: [`
        ::-webkit-scrollbar {
            width: 1px;
            background: transparent;  /* Optional: just make scrollbar invisible */
        }
    `]
})
export class SidebarComponent implements AfterViewInit {
    ngAfterViewInit(): void {
        // jQuery(".sidebar-collapse").slimScroll({
        //     height: "100%",
        //     railOpacity: 0.9
        // });

        // jQuery('#side-menu').metisMenu();
        $('.navbar-default.navbar-static-side').TrackpadScrollEmulator();

        $("#side-menu").metisMenu();
    }
    constructor(
        private router: Router,
        public auth: AuthService,
        private signalr: SignalRService
    ) { }

    Logout() {
        this.auth.Logout();
    }

    lockUser() {
        this.auth.redirectUrl = this.router.url;
        this.signalr.stopConnectionUser();
        this.auth.lockUser();
    }

    gotoIndex() {
        location.replace(this.auth.indexUrl);
    }
}
