import { Component, HostBinding, OnInit, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeService } from './service/theme.service';
import { MainServiceWorkerService } from './service/main-service-worker.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { StudentAuthService } from './service/parent-student-auth.service';
import { LoaderService } from 'public/Services/http-interceptor/loader.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

    isLoading = true;

    @HostBinding('class') componentCssClass = "default-theme";


    constructor(
        public sanitizer: DomSanitizer,
        public overlayContainer: OverlayContainer,
        private themeServ: ThemeService,
        private mainSW: MainServiceWorkerService,
        private router: Router,
        private stdAuth: StudentAuthService
    ) {

        this.themeServ.colorChange$.subscribe(theme => {
            this.onSetTheme(theme + "-theme");
        });

        this.themeServ.setThemeColor("light", true);
    }

    ngAfterViewInit(): void {
        
    }


    onSetTheme(theme) {
        this.overlayContainer.getContainerElement().classList.add(theme);
        this.componentCssClass = theme;
    }
}
