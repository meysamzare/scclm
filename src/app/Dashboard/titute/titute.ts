export class ITitute {
    constructor() {}

    id: number = 0;

    //Nullable
    tituteCode = null;

    name: string = "";

    orgCode: number = null;

    orgSection: string = "";

    //male = 1
    //femaile = 2
    orgSex: number = 1;

    state: string = "";

    city: string = "";

    address: string = "";

    postCode: number = null;

    tell: string = "";

    email: string = "";

    desc: string = "";

    haveChildren: boolean = false;
    haveGrade: boolean = false;

    parentTitle: string = "";
}
