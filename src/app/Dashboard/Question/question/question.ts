export class IQuestion{
    constructor(){}

    id = 0;

    name: string;

    type: number;

    title: string;

    courseId: number;

    gradeId: number;
    
    person: string;

    source: string;

    mark: number = 1;

    defact: number = 2;

    answer: string;

    desc1: string;

    desc2: string;

    complatabelContent: string;


    gradeName = "";
    courseName = "";
    markString = "";

    
}