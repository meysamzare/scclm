import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { ICategory } from 'src/app/Dashboard/category/category';
import { RegisterItemLicenseService } from './register-item-license.service';

@Component({
    selector: 'app-license-for-register-item',
    templateUrl: './license-for-register-item.component.html',
    styleUrls: ['./license-for-register-item.component.scss']
})
export class LicenseForRegisterItemComponent implements OnInit {

    catId: number;

    cat: ICategory;

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        public auth: AuthService,
        private licenseService: RegisterItemLicenseService
    ) {
        this.activeRoute.params.subscribe(params => {
            this.catId = params["id"];
        });

        this.cat = this.activeRoute.snapshot.data.cat;
     }

    ngOnInit() {
    }

    sts() {
        this.licenseService.addLicense(this.catId);
        this.router.navigate([`/register-item/${this.catId}`]);
    }
}
