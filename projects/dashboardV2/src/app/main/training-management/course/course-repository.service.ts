import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { ICourse } from 'src/app/Dashboard/course/course';

@Injectable({
    providedIn: 'root'
})
export class CourseRepositoryService {

    constructor(
        private auth: AuthService
    ) { }

    
    async getAll() {
        let { success, data } = await this.auth.post("/api/Course/getAll").toPromise();

        if (success) {
            return data as ICourse[];
        }

        return [];
    }
}
