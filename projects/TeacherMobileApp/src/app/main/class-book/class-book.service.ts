import { Injectable } from '@angular/core';
import { IStudent } from 'src/app/Dashboard/student/student';
import * as cryptoJSON from 'crypto-json';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ClassBookService {

    private KEY = "_cbd";

    private password = "&@^TETW^@*^#*&@IQE&@"

    constructor() { }

    setClassBookData(data: ICLSBookData) {
        let enc_data = cryptoJSON.encrypt(data, this.password)
        localStorage.setItem(this.KEY, JSON.stringify(enc_data));
    }

    getClassBookData(): Observable<ICLSBookData | null> {
        var item = localStorage.getItem(this.KEY);

        if (item) {
            var data = cryptoJSON.decrypt(JSON.parse(item), this.password)

            return of(data);
        } else {
            return of(null);
        }
    }

    isAnyData(): Observable<boolean> {
        return this.getClassBookData().pipe(
            take(1),
            mergeMap((data) => {
                if (data) {
                    return of(true);
                }
                return of(false);
            })
        )
    }

    clearData() {
        localStorage.removeItem(this.KEY);
    }
}

export class ICLSBookData {
    selectedGrade: number;
    selectedYeareducationId: number;
    selectedTituteId: number;

    selectedCourse: number;
    selectedClass: number;

    accessToAllCourse: boolean;

    studentByClass: IStudent[];

    className?: string;
    gradeName?: string;
    courseName?: string;

}