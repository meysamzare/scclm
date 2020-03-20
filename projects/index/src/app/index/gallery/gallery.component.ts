import { Component, OnInit } from '@angular/core';
import { IPictureGallery } from 'src/app/Dashboard/WebSiteManagment/gallery/picture-gallery/picture-gallery';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

    galleries: IPictureGallery[] = [];

    page = 1;

    totalCount = 0;

    constructor(
        public auth: AuthService
    ) { 
        this.refreshGalleries(true);
    }

    ngOnInit() { }

    refreshGalleries(cleardata = false) {
        this.auth.post("/api/PictureGallery/GetIndex", this.page).subscribe(data => {
            if (data.success) {

                this.totalCount = data.data.count

                if (cleardata) {
                    this.galleries = [];
                    this.page = 1;
                }

                var gall: IPictureGallery[] = data.data.gallery;

                gall.forEach(gal => {
                    this.galleries.push(gal);
                });

            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    
    canShowMoreButton(): boolean {
        var nowItemCount = this.galleries.length;
        var totalItemCount = this.totalCount;

        if (nowItemCount < totalItemCount) {
            return true;
        }

        return false;
    }

}
