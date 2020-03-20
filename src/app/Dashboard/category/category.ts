export class ICategory {
    constructor() { }

    id: number = 0;

    title: string = "";

    desc: string = "";

    parentId?: number = null;

    haveChildren: boolean;

    parentTitle: string;

    datePublish: string;
    timePublish: string = "00:00";

    dateExpire: string;
    timeExpire: string = "00:00";

    isActive: boolean;

    authorizeState: CategoryAuthorizeState;

    license: string;
    haveLicense: boolean = false;

    endMessage: string;

    haveInfo: boolean = false;
    isInfoShow: boolean = false;
    activeMessage: string = "";
    deActiveMessage: string = "";

    roleAccess: number = 0;

    showRow: ShowRow;

    postType: number;

    registerPicUrl = "";
    showInfoPicUrl = "";

    registerFileData = "";
    registerFileName = "";
    showInfoFileData = "";
    showInfoFileName = "";

    headerPicUrl = "";
    headerPicData = "";
    headerPicName = "";

    haveEntringCard = false;
    btnTitle = "";

    datePublishString = "";
    dateExpireString = "";
    canShowByDate = false;

}

export enum ShowRow {
    Up = 1,
    Down = 2
}

export enum CategoryAuthorizeState {
    none = 0,
    TMA = 1,
    PMA = 2,
    SMA = 3,
    All = 4
}
