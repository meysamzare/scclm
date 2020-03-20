export class StdClassMng {
    constructor() { }

    id = 0;

    studentId = 0;

    classId: number = null;

    gradeId: number = null;

    yeareducationId: number = null;

    insTituteId: number = null;

    studentTypeId: number = null;

    studyState: StdStudyState;
    behaveState: StdBehaveState;
    payrollState: StdPayrollState;

    isActive: boolean;

    studentName = "";

    className = "";

    gradeName = "";

    yeareducationName = "";

    tituteName = "";

    studentTypeName = "";

    canRemove = true;
}

export enum StdStudyState {
    Comformd = 1,
    WaitingForComform = 2,
    Accept = 3,
    Conditional = 4,
    Fired = 5,
    MissFile = 6
}

export enum StdBehaveState {
    Accept = 1,
    WaitingForChecking = 2,
    Conditional = 3
}

export enum StdPayrollState {
    Comformd = 1,
    WaitingForComform = 2,
    Active = 3,
    DeActive = 4
}



export function getStdStudyStateString(state) {
    if (state == 0) {
        // خاکستری
        return "نا مشخص";
    }
    if (state == 1) {
        // سبز
        return "تایید";
    }
    if (state == 2) {
        // آبی باز
        return "درانتظار تایید";
    }
    if (state == 3) {
        // قرمز
        return "نقص پرونده";
    }
    if (state == 4) {
        // سبز
        return "قابل قبول";
    }
    if (state == 5) {
        // سبز آبی
        return "درحال پیشرفت";
    }
    if (state == 6) {
        // زرد
        return "مشروط";
    }
    if (state == 7) {
        // قرمز
        return "غیر قابل قبول";
    }

    return "---";
}
export function getStdBehaveStateString(state) {
    if (state == 0) {
        // خاکستری
        return "نامشخص";
    }
    if (state == 1) {
        // سبز
        return "قابل قبول";
    }
    if (state == 2) {
        // زرد
        return "مشروط";
    }
    if (state == 3) {
        // قرمز
        return "غیر قابل قبول";
    }

    return "---";
}
export function getStdPayrollStateString(state) {
    if (state == 0) {
        // خاکستری
        return "نا مشخص";
    }
    if (state == 1) {
        // قرمز
        return "بدهکار";
    }
    if (state == 2) {
        // سبز
        return "تسویه حساب";
    }
    if (state == 3) {
        // آبی
        return "در انتظار تایید";
    }

    return "---";
}


export function getStdStudyStateColorString(state) {
    if (state == 0) {
        // خاکستری
        return "gray";
    }
    if (state == 1) {
        // سبز
        return "lawngreen";
    }
    if (state == 2) {
        // آبی باز
        return "lightblue";
    }
    if (state == 3) {
        // قرمز
        return "red";
    }
    if (state == 4) {
        // سبز
        return "lawngreen";
    }
    if (state == 5) {
        // سبز آبی
        return "lightseagreen";
    }
    if (state == 6) {
        // زرد
        return "yellow";
    }
    if (state == 7) {
        // قرمز
        return "red";
    }

    return "white";
}
export function getStdBehaveStateColorString(state) {
    if (state == 0) {
        // خاکستری
        return "gray";
    }
    if (state == 1) {
        // سبز
        return "lawngreen";
    }
    if (state == 2) {
        // زرد
        return "yellow";
    }
    if (state == 3) {
        // قرمز
        return "red";
    }

    return "white";
}
export function getStdPayrollStateColorString(state) {
    if (state == 0) {
        // خاکستری
        return "gray";
    }
    if (state == 1) {
        // قرمز
        return "red";
    }
    if (state == 2) {
        // سبز
        return "lawngreen";
    }
    if (state == 3) {
        // آبی
        return "blue";
    }

    return "white";
}
