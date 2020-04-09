import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { ITitute } from 'src/app/Dashboard/titute/titute';

@Injectable({
    providedIn: 'root'
})
export class TituteRepositoryService {

    constructor(
        private auth: AuthService
    ) { }

    async getAll() {
        let data = await this.auth.post(`/api/Titute/getAll`).toPromise();

        return data.data as ITitute[];
    }
}
