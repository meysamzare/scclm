export class IStudent {
    constructor() { }

    id = 0;

    code: number;

    orgCode: string;

    name: string;

    lastName: string;

    fatherName: string;

    idNumber: string;

    idNumber2: string;

    birthDate: string;

    idCardSerial: string;

    birthLocation: string;

    picUrl: string;
    picData: string;
    picName: string;

    parentsPassword: string;
    studentPassword: string;

    parentAccess: boolean;
    studentAccess: boolean;

    studentState: studentState;


    isStudentInfoComplated = false;

    haveStdClassMng = false;

    haveStdPayment = false;

    stdClassMngNumber = 0;

    birthDateString = "";


    public get fullName(): string {
        return this.name + " " + this.lastName;
    }


}

export enum studentState {
    PreSubmit = 1,
    Submit = 2,
    Comformd = 3,
    WaitingForComform = 4,
    NotComformd = 5,
    MissFile = 6
}

export function getStudentStateString(state) {
    if (state == 0) {
        return "نا مشخص";
    }
    if (state == 1) {
        return "نقص پرونده";
    }
    if (state == 2) {
        return "در انتظار تایید";
    }
    if (state == 3) {
        return "تعلیق";
    }
    if (state == 4) {
        return "ثبت نام شده";
    }

    return "---";
}

export function getStudentStateColorString(state) {
    if (state == 0) {
        return "gray";
    }
    if (state == 1) {
        return "yellow";
    }
    if (state == 2) {
        return "blue";
    }
    if (state == 3) {
        return "darkseagreen";
    }
    if (state == 4) {
        return "lawngreen";
    }

    return "white";
}