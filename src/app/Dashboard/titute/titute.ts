export class ITitute {
    constructor() {}

    id: number = 0;

    //Nullable
    tituteCode;

    name: string;

    orgCode: number;

    orgSection: string;

    //male = 1
    //femaile = 2
    orgSex: number = 1;

    state: string;

    city: string;

    address: string;

    postCode: number;

    tell: string;

    email: string;

    desc: string;

    haveChildren: boolean = false;
    haveGrade: boolean = false;

    parentTitle: string = "";
}
