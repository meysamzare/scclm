export class IAttr {
    constructor() { }

    id: number;

    title: string;

    gId;

    attrTypeInt: number = null;
    attrType = 1;

    maxFileSize: number;

    desc: string;

    isUniq: boolean;

    orderInt: number = 1;

    categoryId: number = null;

    unitId: number = null;

    placeholder: string;
    isRequired: boolean = true;

    isMeliCode: boolean;

    haveItemAttr: boolean;

    attrTypeString: string;

    catTitle: string;

    unitTitle: string;

    values: string = "";

    haveAnyOption = false;
    haveAnyTrueOption = false;

    score: number = 1;


    isInClient: boolean = true;
    isInShowInfo: boolean = false;
    isInSearch: boolean = false;

    orderInInfo: number = 0;
}
