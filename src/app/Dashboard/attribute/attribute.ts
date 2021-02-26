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

    order: number = 1;
    orderInt: number = 1;

    categoryId: number = null;

    isTemplate = false;

    unitId: number = null;

    placeholder: string;
    isRequired: boolean = true;

    isMeliCode: boolean;

    haveItemAttr: boolean;

    attrTypeString: string;

    catTitle: string;

    unitTitle: string;

    values: string = "";

    isPhoneNumber = false;
    requiredErrorMessage = "";
    uniqErrorMessage = "";

    haveAnyOption = false;
    haveAnyTrueOption = false;

    score: number = 1;

    questionId: number = null;


    isInClient: boolean = true;
    isInShowInfo: boolean = false;
    isInSearch: boolean = false;

    orderInInfo: number = 0;
}

export function getAttributeTypeString(attrType: number) {
    if (attrType == 1) {
        return "متن";
    }
    if (attrType == 2) {
        return "عدد";
    }
    if (attrType == 3) {
        return "تاریخ";
    }
    if (attrType == 4) {
        return "انتخابی";
    }
    if (attrType == 5) {
        return "رمز";
    }
    if (attrType == 6) {
        return "لیست";
    }
    if (attrType == 7) {
        return "تصویر";
    }
    if (attrType == 8) {
        return "فایل";
    }
    if (attrType == 9) {
        return "پاراگراف";
    }
    if (attrType == 10) {
        return "گزینشی";
    }
    if (attrType == 11) {
        return "بانک سوالات";
    }

    return "";
}

export function getAttributeTypeIcon(attrType: number) {
    if (attrType == 1) {
        return "short_text";
    }
    if (attrType == 2) {
        return "looks_4";
    }
    if (attrType == 3) {
        return "date_range";
    }
    if (attrType == 4) {
        return "check_box";
    }
    if (attrType == 5) {
        return "lock";
    }
    if (attrType == 6) {
        return "list";
    }
    if (attrType == 7) {
        return "image";
    }
    if (attrType == 8) {
        return "insert_drive_file";
    }
    if (attrType == 9) {
        return "wrap_text";
    }
    if (attrType == 10) {
        return "radio_button_checked";
    }
    if (attrType == 11) {
        return "help";
    }

    return "";
}