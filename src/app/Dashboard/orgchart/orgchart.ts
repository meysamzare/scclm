export class IOrgChart{
    constructor(){}

    id: number = 0;

    name: string;

    code: number;

    parentId?: number = null;

    order: number;

    desc: string;

    haveChildren = false;
    havePerson = false;

    parentTitle = "";
}