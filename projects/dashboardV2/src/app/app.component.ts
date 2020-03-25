import { Component, HostBinding } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
    selector: 'synapse-srcm',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    @HostBinding('class') componentCssClass = "default-theme";

    constructor(
        public overlayContainer: OverlayContainer,
        private themeServ: ThemeService,
    ) {
        this.themeServ.colorChange$.subscribe(theme => {
            this.onSetTheme(theme + "-theme");
        });

        this.themeServ.setCurrentTheme();
    }


    onSetTheme(theme) {
        let containerClassList = this.overlayContainer.getContainerElement().classList;

        containerClassList.forEach(classname => {
            if (classname != "cdk-overlay-container") {
                containerClassList.remove(classname);
            }
        });

        containerClassList.add(theme);

        this.componentCssClass = theme;
    }

}
