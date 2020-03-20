export class ITicket {
    constructor() { }

    id = 0;

    subject: string;
    order: TicketOrder = TicketOrder.Low;
    state: TicketState;

    senderType: TicketType;
    senderId: number;
    senderName: string;

    reciverType: TicketType;
    reciverId: number;
    reciverName: string;

    isRemoved: boolean;

    getTicketOrderString(): string {
        var order = this.order;

        if (order == TicketOrder.Low) {
            return "عادی";
        }

        if (order == TicketOrder.Modrate) {
            return "فوری";
        }

        if (order == TicketOrder.High) {
            return "خیلی فوری";
        }

        if (order == TicketOrder.Emergency) {
            return "ضروری";
        }

        if (order == TicketOrder.Request) {
            return "درخواست";
        }

        return "";
    }

    getTicketTypeString(senderOrReciver: 1 | 2): string {
        var type = senderOrReciver == 1 ? this.senderType : this.reciverType;

        if (type == TicketType.Student) {
            return "دانش آموز";
        }

        if (type == TicketType.StudentParent) {
            return "اولیای دانش آموز";
        }

        if (type == TicketType.User) {
            return "کاربر";
        }

        if (type == TicketType.Teacher) {
            return "دبیر";
        }
    }

    getTicketStateString(): string {
        var state = this.state;

        if (state == TicketState.Open) {
            return "باز";
        }

        if (state == TicketState.Close) {
            return "بسته";
        }

        if (state == TicketState.WaitingForAnswer) {
            return "منتظر پاسخ";
        }
    }

    newConversations = 0;
}


export function getTicketOrderString(order: TicketOrder): string {

    if (order == TicketOrder.Low) {
        return "عادی";
    }

    if (order == TicketOrder.Modrate) {
        return "فوری";
    }

    if (order == TicketOrder.High) {
        return "خیلی فوری";
    }

    if (order == TicketOrder.Emergency) {
        return "ضروری";
    }

    if (order == TicketOrder.Request) {
        return "درخواست";
    }

    return "";
}

export function getTicketOrderColor(order: TicketOrder): string {

    if (order == TicketOrder.Low) {
        return "deepskyblue";
    }

    if (order == TicketOrder.Modrate) {
        return "coral";
    }

    if (order == TicketOrder.High) {
        return "orangered";
    }

    if (order == TicketOrder.Emergency) {
        return "indianred";
    }

    if (order == TicketOrder.Request) {
        return "greenyellow";
    }

    return "unset";
}

export function getTicketTypeString(type: TicketType): string {

    if (type == TicketType.Student) {
        return "دانش آموز";
    }

    if (type == TicketType.StudentParent) {
        return "اولیای دانش آموز";
    }

    if (type == TicketType.User) {
        return "کاربر";
    }

    if (type == TicketType.Teacher) {
        return "دبیر";
    }
}

export function getTicketStateString(state: TicketState): string {

    if (state == TicketState.Open) {
        return "باز";
    }

    if (state == TicketState.Close) {
        return "بسته";
    }

    if (state == TicketState.WaitingForAnswer) {
        return "منتظر پاسخ";
    }
}

export enum TicketOrder {
    Low = 0,
    Modrate = 1,
    High = 2,
    Emergency = 3,
    Request = 4
}

export enum TicketState {
    Open = 0,
    Close = 1,
    WaitingForAnswer = 2
}

export enum TicketType {
    Student = 0,
    StudentParent = 1,
    User = 2,
    Teacher = 3
}

export class ITicketConversation {
    constructor() { }

    id = 0;

    content: string = "";
    date: string;
    rate: number;

    fileUrl: string;
    fileData: string = "";
    fileName: string = "";

    isSender: boolean;
    isSeen: boolean;
    ticketId: number;

    dateString = "";

    trustedContent = null;
}