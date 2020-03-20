export class IAttr {
    constructor() { }

    id: number;

    title: string;

    gId;

    attrTypeInt: number = null;

    desc: string;

    isUniq: boolean;

    orderInt: number;

    categoryId: number = null;

    unitId: number = null;
    
    placeholder: string;
    isRequired: boolean;

    isMeliCode: boolean;

    haveItemAttr: boolean;

    attrTypeString: string;

    catTitle: string;

    unitTitle: string;

    values: string = "";


    isInClient: boolean = true;
    isInShowInfo: boolean = false;
    isInSearch: boolean = false;

    orderInInfo: number;
}
