export class INotification {

    constructor() { }

    id = 0;

    title: string;

    shortContent: string;

    content: string;

    buttonTitle: string = "جزئیات بیشتر";

    sendDate: string;

    createDate: string;

    isShow = false;

    notiifcationType: NotiifcationType = NotiifcationType.Info;

    showType: NotificationShowType = NotificationShowType.StudentParent;

    sendDateString = "";

    createDateString = "";
}

export function getNotificationShowTypeString(showType: NotificationShowType): string {
    if (showType == 0) {
        return "اپ دانش آموز";
    }

    if (showType == 1) {
        return "اپ اولیای دانش آموز";
    }

    if (showType == 2) {
        return "تمامی اپ ها";
    }
    if (showType == 3) {
        return "صفحه ورود دبیران";
    }
    if (showType == 4) {
        return "صفحه ورود اولیا";
    }
    if (showType == 5) {
        return "صفحه ورود پرتال";
    }
    if (showType == 6) {
        return "تمامی صفحات ورود";
    }

    return "---";
}

export function getNotificationTypeString(type: NotiifcationType): string {
    if (type == 0) {
        return "اطلاعیه";
    }
    if (type == 1) {
        return "موفق";
    }
    if (type == 2) {
        return "هشدار";
    }
    if (type == 3) {
        return "اخطار";
    }
}

export function getNotificationTypeColorClass(type): string {
    if (type == 0) {
        return "info";
    }
    if (type == 1) {
        return "success";
    }
    if (type == 2) {
        return "warning";
    }
    if (type == 3) {
        return "danger";
    }
}


export enum NotificationShowType {
    Student = 0,
    StudentParent = 1,
    Both = 2,
    TMALogin = 3,
    PMALogin = 4,
    DashboardLogin = 5,
    AllLogin = 6
}

export enum NotiifcationType {
    Info = 0,
    Success = 1,
    Warning = 2,
    Danger = 3
}


export class INotificationAgent {

    constructor() { }

    id = 0;

    subscribeDate: string;

    studentId: string;

    isParent: string;

    endpoint: string;

    p256DH: string;

    auth: string;

    subscribeDateString: string;

    studentFullNameAndType = "";
}

export class INotificationSeen {
    id: string;

    notificationId: number;

    agentName: string;

    agentId: number;

    agentType: number;

    agentFullName: string;

    gradeId: number;

    classId: number;

    dateString = "";
}