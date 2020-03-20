import { Injectable } from "@angular/core";
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from "@angular/material";
import { interval } from "rxjs/internal/observable/interval";


@Injectable()
export class UpdateService {
    constructor(private swUpdate: SwUpdate, private snackbar: MatSnackBar) {
        if (swUpdate.isEnabled) {
            interval(6 * 60 * 60).subscribe(() => swUpdate.checkForUpdate());
        }
    }

    public checkForUpdates(): void {
        this.swUpdate.available.subscribe(evt => {
            this.swUpdate.activateUpdate();

            const snack = this.snackbar.open('نسخه جدیدی از برنامه در دسترس است', 'راه اندازی مجدد', {
                duration: 5000
            });

            snack.onAction().subscribe(() => {
                window.location.reload();
            });
        });
    }
}