import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { IPicture } from 'src/app/Dashboard/WebSiteManagment/gallery/picture/picture';
import { IPictureGallery } from 'src/app/Dashboard/WebSiteManagment/gallery/picture-gallery/picture-gallery';
import { MatDialog } from '@angular/material';
import { ViewImageModalComponent } from './view-image-modal/view-image-modal.component';

@Component({
    selector: 'app-view-gallery',
    templateUrl: './view-gallery.component.html',
    styleUrls: ['./view-gallery.component.scss']
})
export class ViewGalleryComponent implements OnInit {

    pics: IPicture[] = [];

    gallery: IPictureGallery = new IPictureGallery();

    constructor(
        public auth: AuthService,
        private message: MessageService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private dialog: MatDialog
    ) {
        this.activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {
                this.pics = data.pics;
            });

            this.auth.post("/api/PictureGallery/getPictureGallery", params["id"]).subscribe(data => {
                if (data.success) {
                    this.gallery = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

        });
    }

    ngOnInit() { }

    viewImage(url) {
        const dialog = this.dialog.open(ViewImageModalComponent, {
            data: {
                url: url
            }
        });
        
    }

}
