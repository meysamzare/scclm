export class IItem {
    constructor() {}

    id: number;

    title: string;

    isActive: boolean = false;

    tags: string;

    unitId: number = 0;

    authorizedBy: string;

    categoryId: number = null;

    categoryString;

    unitString;

    categoryRoleAccess = 0;

    dateAddPersian = "";
    dateEditPersian = "";
}
