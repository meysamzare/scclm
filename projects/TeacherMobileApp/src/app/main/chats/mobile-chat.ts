export class IMobileChat {

    constructor() { }

    id = 0;

    senderType: MobileChatType;
    senderId: number;
    senderName: string;

    reciverType: MobileChatType;
    reciverId: number;
    reciverName: string;

    text: string = "";
    isRead: boolean = false;

    sendDate: string;
    reciveDate: string;

    fileUrl: string;
    fileName: string;
    fileData: string = "";

    sendDateString = "";
    reciveDateString = "";
}

export class IMobileChatConversation {
    clientId = 0;
    clientType = 0;
    clientImg = "";
    clientName = "";
    lastChatText = "";
    lastChatDate = "";
    unreadCount = 0;
}

export enum MobileChatType {
    StudentParent = 0,
    Teacher = 1
}