import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IGrade } from 'src/app/Dashboard/grade/grade';

@Injectable({
    providedIn: 'root'
})
export class GradeRepositoryService {

    constructor(
        private auth: AuthService
    ) { }

    
    async getAll() {
        let { success, data } = await this.auth.post("/api/Grade/getAll").toPromise();

        if (success) {
            return data as IGrade[];
        }

        return [];
    }
}
