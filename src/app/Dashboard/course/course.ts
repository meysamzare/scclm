export class ICourse{
    constructor(){}

    id = 0;

    name: string;

    gradeId: number;

    courseMix: number;

    order: number;

    order2: number;

    teacherId: number;

    teachTime: number;


    haveTimeSchedules = false;
    haveExam = false;

    gradeName = "";
    teacherName = "";

    yeareducationId: number = null;
}