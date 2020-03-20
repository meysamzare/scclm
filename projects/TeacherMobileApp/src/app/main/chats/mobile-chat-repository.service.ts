import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IMobileChat, MobileChatType } from './mobile-chat';
import { ILogParam } from 'src/app/shared/Auth/log';

@Injectable({
    providedIn: 'root'
})
export class MobileChatRepositoryService {

    constructor(
        private auth: AuthService
    ) { }

    AddChat(chat: IMobileChat, log?: ILogParam) {
        return this.auth.post("/api/MobileChat/AddChat", chat, log);
    }

    GetConversations(page: number, Id: number, Type: MobileChatType, q = "", log?: ILogParam) {
        return this.auth.post("/api/MobileChat/GetConversations", {
            page: page,
            id: Id,
            type: Type,
            q: q
        }, log);
    }

    GetChats(id, type, clientId, clientType, page, log?: ILogParam) {
        return this.auth.post("/api/MobileChat/GetChats", {
            id: id,
            type: type,
            clientId: clientId,
            clientType: clientType,
            page: page
        }, log);
    }

    setAllChatSeen(
        id: number,
        type: MobileChatType,
        senderId: number,
        senderType: MobileChatType, log?: ILogParam) {

        return this.auth.post("/api/MobileChat/setAllChatSeen", {
            id: id,
            type: type,
            senderId: senderId,
            senderType: senderType
        }, log);
    }
}