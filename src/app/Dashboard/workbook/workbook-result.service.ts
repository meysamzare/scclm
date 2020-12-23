import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { ILogParam } from 'src/app/shared/Auth/log';
import { IDescriptiveScore } from '../Exam/descriptive-score/descriptive-score';

export type StudentWorkbookResult = {
    headers: string[],
    courseAvgs: string[],
    totalAvg: string,
    ratingsInClass: string[],
    ratingsInGrade: string[],
    ratingOfTotalAvgClass: string,
    ratingOfTotalAvgGrade: string,
    avgOfTotalAvrageGrade: string,
    topTotalAvrageGrade: string,
    isDescriptiveScore: boolean,
    isTotalAvgBiggerThanAvgOfTotalAvg: boolean
};

@Injectable({
    providedIn: 'root'
})
export class WorkbookResultService {

    constructor(
        private auth: AuthService
    ) { }

    async getStudnetWorkbook(studentId: number, gradeId: number, classId: number, workbookId: number, log: ILogParam = null) {

        if (!studentId || !gradeId || !classId || !workbookId) {
            return null;
        }

        const descScoreData = await this.auth.post("/api/DescriptiveScore/getAll").toPromise();

        const descriptiveScores: IDescriptiveScore[] = descScoreData.data;

        const obj = {
            studentId: studentId,
            gradeId: gradeId,
            classId: classId,
            workbookId: workbookId
        };

        const data = await this.auth.post("/api/ExamScore/getTotalAverageByStudentGrade", obj, log).toPromise();

        if (data.success) {

            let headers: string[] = data.data.headers;

            let courseAvgs: number[] = data.data.courseAvgs;
            let totalAvg: number = data.data.totalAvg;


            let ratingsInClass: number[] = data.data.ratingsInClass;
            let ratingsInGrade: number[] = data.data.ratingsInGrade;
            let ratingOfTotalAvgClass: number = data.data.ratingOfTotalAvgClass;
            let ratingOfTotalAvgGrade: number = data.data.ratingOfTotalAvgGrade;
            let avgOfTotalAvrageGrade: number = data.data.avgOfTotalAvrageGrade;
            let topTotalAvrageGrade: number = data.data.topTotalAvrageGrade;

            const isDescriptiveScore: boolean = data.data.isDescriptiveScore;

            let returnObject: StudentWorkbookResult = {
                headers: headers,
                courseAvgs: courseAvgs.map(String),
                totalAvg: totalAvg.toFixed(2).toString(),
                ratingsInClass: ratingsInClass.map(String),
                ratingsInGrade: ratingsInGrade.map(String),
                ratingOfTotalAvgClass: ratingOfTotalAvgClass.toString(),
                ratingOfTotalAvgGrade: ratingOfTotalAvgGrade.toString(),
                avgOfTotalAvrageGrade: avgOfTotalAvrageGrade.toFixed(2).toString(),
                topTotalAvrageGrade: topTotalAvrageGrade.toFixed(2).toString(),
                isDescriptiveScore: isDescriptiveScore,
                isTotalAvgBiggerThanAvgOfTotalAvg: totalAvg >= avgOfTotalAvrageGrade
            };


            if (isDescriptiveScore) {
                courseAvgs.forEach((courseAvg, index) => {
                    returnObject.courseAvgs[index] = this.getDescriptiveScoreNameForScore(descriptiveScores, courseAvg);
                });
                returnObject.totalAvg = this.getDescriptiveScoreNameForScore(descriptiveScores, totalAvg);
                returnObject.isTotalAvgBiggerThanAvgOfTotalAvg = true;
            }

            return returnObject;

        } else {
            this.auth.message.showMessageforFalseResult(data);
            return null;
        }
    }

    getDescriptiveScoreNameForScore(descriptiveScores: IDescriptiveScore[], score: number) {
        const descScore = descriptiveScores.find(c => score >= c.fromNumber && score <= c.toNumber);

        if (descScore) {
            return descScore.name;
        }

        return "---";
    }
}
