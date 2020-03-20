import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RegisterItemLicenseService {

    key = "liregit";

    constructor(
        private auth: AuthService
    ) { }


    isUserAcceptTheLicense(catId: number): boolean {
        let licenses = this.getLicenses();

        let catLicense = licenses.find(c => c == catId);

        if (catLicense) {
            return true;
        }

        return false;
    }


    addLicense(catId: number) {
        let licenses = this.getLicenses();

        let catLicense = licenses.find(c => c == catId);
        

        if (!catLicense) {
            licenses.push(catId);

            this.setLicenses(licenses);
        }
    }
    removeLicense(catId: number) {
        let licenses = this.getLicenses();

        let catLicense = licenses.find(c => c == catId);

        if (catLicense) {
            licenses.splice(licenses.findIndex(c => c == catId), 1);
        }

        this.setLicenses(licenses);
    }
    setLicenses(catIds: number[]) {
        let textToEncript = JSON.stringify(catIds);

        let encriptedText = this.auth.encript(textToEncript);

        localStorage.setItem(this.key, encriptedText);
    }
    getLicenses(): number[] {
        let licenses = localStorage.getItem(this.key);

        if (licenses) {
            return JSON.parse(this.auth.decript(licenses));
        }

        return [];
    }
}