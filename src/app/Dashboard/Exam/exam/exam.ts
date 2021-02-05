export class IExam {
    constructor() { }

    id = 0;

    name: string;

    parentId?: number = null;


    date: string;

    numberQ: number;
    source: string;
    topScore: number;

    examTypeId: number;

    gradeId: number;

    classId: number;

    teacherId: number;

    order: number;

    courseId: number;

    time: number;

    result: boolean = false;

    workbookId: number = null;

    resultDate: string;

    isCancelled: boolean;
    cancellReason: string;

    showAvgOfExam: boolean;

    avgInExam = 0;
    minInExam = 0;
    maxInExam = 0;

    haveChildren = false;

    haveScore = false;

    parentName = "";
    gradeName = "";
    className = "";
    teacherName = "";
    yeareducationName = "";
    courseName = "";
    examTypeName = "";
    dateString = "";

    resultTime: string = "";


}