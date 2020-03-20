export class IScoreThemplate {
    constructor() { }

    id = 0;

    title: string;
    type: string;
    subject: string;
    value: number;
}


/**
 * 
 * @param titleInNumber Form 0 To 2
 */
export function getTitleByNumber(titleInNumber) {
    if (titleInNumber == 0) {
        return "آموزشی";
    }
    if (titleInNumber == 1) {
        return "پرورشی";
    }
    if (titleInNumber == 2) {
        return "مدیریت";
    }

    return "---";
}

/**
 * 
 * @param typeInNumber Form 0 To 3
 */
export function getTypeByNumber(typeInNumber) {
    if (typeInNumber == 0) {
        return "A";
    }
    if (typeInNumber == 1) {
        return "B";
    }
    if (typeInNumber == 2) {
        return "C";
    }
    if (typeInNumber == 3) {
        return "D";
    }

    return "---";
}