export class IExamScore {
    constructor() { }

    id = 0;

    examId: number;
    studentId: number;

    score: number;

    topScore: number;
    numberQ: number;

    state = 0;

    trueAnswer: number;
    falseAnswer: number;
    blankAnswer: number;

    studentName: string = "";
    examName: string = "";
    scoreString: string = "";

    rating: string = "";
}