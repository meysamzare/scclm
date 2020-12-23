export class IYeareducation {
    constructor() { }

    id: number = 0;

    name: string;

    dateStart: string;

    dateEnd: string;

    desc: string;

    isActive = false;

    scoreType: YeareducationScoreType = YeareducationScoreType.Normal;

    haveGrade: boolean = false;
    haveExam = false;

    dateStartPersian: string = "";
    dateEndPersian: string = "";
}

export enum YeareducationScoreType {
    Normal = 1,
    Descriptive
}