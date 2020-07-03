import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IClass } from 'src/app/Dashboard/class/class';

@Injectable({
    providedIn: 'root'
})
export class ClassRepositoryService {

    constructor(
        private auth: AuthService
    ) { }

    
    async getAll() {
        let { success, data } = await this.auth.post("/api/Class/getAll").toPromise();

        if (success) {
            return data as IClass[];
        }

        return [];
    }
}
