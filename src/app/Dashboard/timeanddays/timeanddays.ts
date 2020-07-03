export class ITimeAndDays{
    constructor(){}

    id = 0;

    name: string = "";

    sat = false;
    sun = false;
    mon = false;
    tue = false;
    wed = false;
    thr = false;
    fri = false;

    haveTimeSchedules = false;

    getNameOfSelectedDays: string[] = [];
}