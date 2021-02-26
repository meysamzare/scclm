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

    isActive: boolean = true;

    showScoreAfterDone = false;

    calculateNegativeScore = false;

    isArchived = false;

    authorizeState: CategoryAuthorizeState = CategoryAuthorizeState.none;

    license: string;
    haveLicense: boolean = false;

    isBackStepAllowed: boolean = false;

    registerItemStepType: CategoryRegisterItemStepType = CategoryRegisterItemStepType.noStep;

    isPined: boolean;

    endMessage: string;

    haveInfo: boolean = false;
    isInfoShow: boolean = false;
    activeMessage: string = "";
    deActiveMessage: string = "";

    roleAccess: number = 0;

    showRow: ShowRow = 1;


    type = 0;
    gradeId: number = null;
    classId: number = null;
    randomAttribute: boolean = false;
    randomAttributeOption: boolean = false;

    courseId: number = null;
    courseString = "";
    examTypeId: number = null;
    examTypeString = "";
    workbookId: number = null;
    workbookString = "";

    useLimitedRandomQuestionNumber = false;

    veryHardQuestionNumber: number = null;
    hardQuestionNumber: number = null;
    moderateQuestionNumber: number = null;
    easyQuestionNumber: number = null;

    gradeString = "";
    classString = "";


    teachersIdAccess: number[] = [];



    formatedDateEnd = "";

    postType: number = 1;

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


export enum CategoryRegisterItemStepType {
    noStep = 0,
    singleAttrStep = 1,
    unitAttrStep = 2
}
