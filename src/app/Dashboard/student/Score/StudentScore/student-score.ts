export class IStudentScore {
    constructor() { }

    id = 0;

    title: string;
    type: string;
    subject: string;
    value: number;

    teacherId: number;

    stdClassMngId: number;

    studentFullName = "";
    studentId: number = null;

    teacherName = "";
    dateCreateString = "";
}