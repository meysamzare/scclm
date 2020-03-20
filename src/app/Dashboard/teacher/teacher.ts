export class ITeacher{
    constructor(){}

    id = 0;

    code: number;

    name: string;

    orgPersonId: number;

    password: string;

    allCourseAccess: boolean;

    
    haveTimeSchedules = false;
    haveCourses = false;

    getPersonelCode = "";
}