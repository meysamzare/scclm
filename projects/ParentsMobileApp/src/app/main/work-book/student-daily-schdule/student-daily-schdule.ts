export class IStudentDailySchedule {

    constructor() { }

    id = 0;
    stdClassMngId: number = null;

    dateCreate = "";
    dateExecute = "";

    courseId: number = null;

    state: StudentDailyScheduleState = null;
    type: StudentDailyScheduleType = null;

    volume = "";

    fromTime = "";
    toTime = "";

    studentParentComment = "";
    studentParentCommentDate = "";
    consultantComment = "";
    consultantCommentDate = "";



    dateCreateString = "";

    dateExecuteString = "";
    dateExecuteDayString = "";

    studentParentCommentDateString = "";
    consultantCommentDateString = "";

    typeString = "";
    courseName = "";
}


export enum StudentDailyScheduleState {
    NotLooked = 1,
    Complated,
    Empty,
    InComplate
}

export enum StudentDailyScheduleType {
    Motalee = 1,
    TestMotalee,
    TestMoroor,
    Moroor,
    Jambandi
}