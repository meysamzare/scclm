export class IClassBook {
    constructor() { }

    id = 0;

    studentId: number;
    insTituteId: number;
    yeareducationId: number;
    gradeId: number;
    classId: number;
    courseId: number;
    teacherId: number;

    date: string;
    type: ClassBookType;
    value: string;

    examId: number;
    examName: string = "";

    registerType: ClassBookRegisterType;
    registerId: number;

    dateString: string;

    teacherName = "";
    courseName = "";
}

export function getClassBookTypeString(type: ClassBookType) {

    if (type == 0) {
        return "حضور، غیاب";
    }
    if (type == 1) {
        return "نمره آزمون";
    }
    if (type == 2) {
        return "پرسش کلاسی";
    }
    if (type == 3) {
        return "مثبت / منفی";
    }
    if (type == 4) {
        return "مورد انضباطی";
    }

    return "---";
}

export function getClassBookRegisterTypeString(type: ClassBookRegisterType) {
    if (type == 0) {
        return "کاربر"
    }

    if (type == 1) {
        return "دبیر"
    }

    return "---";
}

export function getClassBookResult(type: ClassBookType, value: string, examName = "", shortStrings = true): IClassBookResult {
    if (type == ClassBookType.P_A) {
        return {
            result: value == 'P' ? "حاضر" : "غائب",
            color: value == 'P' ? "green" : "red"
        }

    }

    if (type == ClassBookType.ExamScore) {
        return {
            result: examName + ': ' + value,
            color: "unset"
        }
    }

    if (type == ClassBookType.ClassAsk || type == ClassBookType.Discipline) {

        var res = "";

        if (shortStrings) {
            res = value.length > 30 ? value.substr(0, 30) + '...' : value;
        } else {
            res = value
        }

        return {
            result: res,
            color: "unset"
        }
    }

    if (type == ClassBookType.Point) {
        return {
            result: +value == 1 ? "+" : "-",
            color: +value == 1 ? "green" : "red"
        }
    }

    return null;
}

export function getDesiplineTypeString(type): string {
    if (type == 1) {
        return "غیبت یا تاخیر موجه";
    }
    if (type == 2) {
        return "اخراج از کلاس";
    }
    if (type == 3) {
        return "نداشتن تکلیف";
    }
    if (type == 4) {
        return "درگیری با سایرین";
    }
    if (type == 5) {
        return "رفتار نامطلوب";
    }
    if (type == 6) {
        return "رعایت نکردن بهداشت فردی";
    }
    if (type == 7) {
        return "جاماندن از سرویس";
    }
    if (type == 8) {
        return "عدم توجه به تذکرات مسئولین";
    }
    if (type == 9) {
        return "نیاوردن یا جاگذاشتن وسایل";
    }
    if (type == 10) {
        return "همراه داشتن وسایل ممنوعه";
    }
    if (type == 11) {
        return "تاخیر غیرموجه";
    }
    if (type == 12) {
        return "غیبت غیرموجه";
    }
    if (type == 13) {
        return "سایر موارد";
    }

    return "";
}

export class IClassBookResult {
    result: string;

    color: string;
}


export enum ClassBookType {
    P_A = 0,
    ExamScore = 1,
    ClassAsk = 2,
    Point = 3,
    Discipline = 4
}

export enum ClassBookRegisterType {
    User = 0,
    Teacher = 1
}