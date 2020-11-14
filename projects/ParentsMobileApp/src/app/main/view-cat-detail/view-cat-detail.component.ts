import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IItemAttr } from 'src/app/Dashboard/item/item-attr';
import { IAttr } from 'src/app/Dashboard/attribute/attribute';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IAttributeOption } from 'src/app/Dashboard/attribute/attribute-option';
import { finalize } from 'rxjs/operators';
import { ViewCatDetailTokenService } from './view-cat-detail-token.service';

@Component({
    selector: 'app-view-cat-detail',
    templateUrl: './view-cat-detail.component.html',
    styleUrls: ['./view-cat-detail.component.scss']
})
export class ViewCatDetailComponent implements OnInit {

    catId = 0;
    catName = "";
    itemId = 0;

    canShowDetail = false;

    constructor(
        private activeRoute: ActivatedRoute,
        private auth: AuthService,
        private viewCatDetailTokenService: ViewCatDetailTokenService,
        private router: Router
    ) { }

    ngOnInit() {

        this.activeRoute.params.subscribe(param => {
            this.catId = param["catId"];
            this.itemId = param["itemId"];
            this.catName = param["catName"];

            const viewToken: string = this.activeRoute.snapshot.queryParams["token"];

            if (!viewToken) {
                this.router.navigateByUrl("/");
                return;
            }

            const parsedData = this.viewCatDetailTokenService.parseToken(viewToken);            

            if (parsedData.catId != this.catId || parsedData.itemId != this.itemId) {
                this.router.navigateByUrl("/");
                return;
            }

            this.canShowDetail = true;
        });
    }

}
