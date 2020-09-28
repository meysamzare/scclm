import { Component, OnInit } from '@angular/core';
import { IExam } from '../../Exam/exam/exam';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IStudent } from '../../student/student';
import { IExamScore } from '../../Exam/examscore/examscore';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { trigger, transition, style, animate } from '@angular/animations';
import { ICourse } from '../../course/course';
import { MatDialog } from '@angular/material';
import { ExamDetailsComponent } from '../../home/exam-details/exam-details.component';

@Component({
    selector: 'app-exam-analize',
    templateUrl: './exam-analize.component.html',
    styleUrls: ['./exam-analize.component.scss'],
    animations: [
        trigger(
            "enterAnim", [
            transition(":enter", [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition(":leave", [
                style({ transform: 'translateX(0)', opacity: 1 }),
                animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
            ])
        ]
        )
    ]
})
export class ExamAnalizeComponent implements OnInit {

    selectedExam = null;
    exams: any[] = [];


    examAnalizeDatas: ExamAnalizeData[] = [];

    courses: ICourse[] = [];
    selectedCourse: number = null;

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private message: MessageService,
        public auth: AuthService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.auth.post("/api/Exam/getAllWithOE").subscribe(data => {
            if (data.success) {
                this.exams = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
        this.auth.post("/api/Course/getAll", null).subscribe(data => {
            if (data.success) {
                this.courses = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    addExamChart() {

        if (this.examAnalizeDatas.find(c => c.ID == this.selectedExam)) {
            this.message.showWarningAlert("این آزمون در لیست موجود است");
        } else {
            this.auth.post("/api/Exam/getExamAnalizeData", this.selectedExam, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Add ExamAnalizeData To Compaire List',
                logSource: 'dashboard',
                object: {
                    selectedExam: this.selectedExam
                },
                table: "ExamAnalyze",
                tableObjectIds: [this.selectedExam]
            }).subscribe(data => {
                if (data.success) {

                    var examScores: IExamScore[] = data.data.exam.examScores;
                    var students: IStudent[] = data.data.students;
                    var exam: IExam = data.data.exam;
                    var studentTypes: {
                        id: number;
                        name: string;
                        desc: string;
                        students: IStudent[]
                    }[] = data.data.studentTypes;

                    var chartData: ChartDataSets[] = [
                        { data: [], label: "نمره", backgroundColor: "green" }
                    ];
                    var chartLabel: Label[] = [];

                    students.forEach(std => {
                        chartLabel.push(std.name + " " + std.lastName);

                        chartData[0].data.push(examScores.find(c => c.studentId == std.id).score);
                    });

                    var arrayOfTypeChartData: Array<ChartDataSets[]> = [];
                    var arrayOfTypeChartLabel: Array<Label[]> = [];
                    var arreyOfStdTypeName: string[] = [];

                    var typesAvgs: number[] = [];
                    var typesMin: number[] = [];
                    var typesMax: number[] = [];

                    studentTypes.forEach(stdTypes => {
                        let chartData: ChartDataSets[] = [
                            { data: [], label: "نمره", backgroundColor: "green" }
                        ];
                        let chartLabel: Label[] = [];

                        let scores: number[] = [];

                        stdTypes.students.forEach(std => {
                            chartLabel.push(std.name + " " + std.lastName);

                            chartData[0].data.push(examScores.find(c => c.studentId == std.id).score);

                            scores.push(examScores.find(c => c.studentId == std.id).score);
                        })

                        if (chartLabel.length != 0) {
                            arreyOfStdTypeName.push(stdTypes.name);
                            arrayOfTypeChartData.push(chartData);
                            arrayOfTypeChartLabel.push(chartLabel);

                            typesAvgs.push(this.getAvgOfScore(scores));
                            typesMin.push(this.getMinOfScore(scores));
                            typesMax.push(this.getMaxOfScore(scores));
                        }
                    })


                    this.examAnalizeDatas.unshift({
                        ID: data.data.exam.id,
                        exam: data.data.exam,
                        students: data.data.students,
                        examscores: examScores,
                        chartData: chartData,
                        chartLabel: chartLabel,
                        typesChartDatas: arrayOfTypeChartData,
                        typesChartLabels: arrayOfTypeChartLabel,
                        typeNames: arreyOfStdTypeName,
                        typesAvgs: typesAvgs,
                        typesMin: typesMin,
                        typesMax: typesMax,
                        isOE: data.data.exam.isOE
                    });

                    this.selectedExam = null;

                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }

    }

    getAvgOfScore(scores: number[]) {
        var count = scores.length;
        var sum = 0;

        scores.forEach(score => {
            sum += score;
        });

        if (sum == 0) {
            return 0;
        }
        return (sum / count);
    }

    getMinOfScore(scores: number[]) {
        return Math.min(...scores);
    }

    getMaxOfScore(scores: number[]) {
        return Math.max(...scores);
    }

    removeExamChart(id) {
        var exanalize = this.examAnalizeDatas.find(c => c.ID == id);

        if (exanalize) {
            this.examAnalizeDatas.splice(this.examAnalizeDatas.indexOf(exanalize), 1);
        }
    }

    isAnyExamWithId(id) {
        if (this.examAnalizeDatas.find(c => c.ID == id)) {
            return true;
        }

        return false;
    }

    getFiltredExams() {
        if (this.selectedCourse) {
            return this.exams.filter(c => c.courseId == this.selectedCourse);
        }

        return this.exams;
    }
    
    showExamDetail(examId) {
        const dialog = this.dialog.open(ExamDetailsComponent, {
            data: {
                examId: examId
            }
        });
    }

}

export interface ExamAnalizeData {

    ID: number;

    students: IStudent[];
    examscores: IExamScore[];
    exam: IExam;

    chartData: ChartDataSets[];
    chartLabel: Label[];

    typesChartDatas?: Array<ChartDataSets[]>;
    typesChartLabels?: Array<Label[]>;
    typeNames: string[];

    typesAvgs: number[];
    typesMin: number[];
    typesMax: number[];

    isOE: boolean;
}
