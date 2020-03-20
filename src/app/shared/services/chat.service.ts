import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { AuthService, jsondata } from '../Auth/auth.service';
import { MessageService } from './message.service';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    unReadMessages: INewMessage[] = [];

    public newMessage$ = new Subject<INewMessage>();
    public clearMessageNavbar$ = new Subject<number>();

    constructor(
        private auth: AuthService,
        private message: MessageService
    ) {
        this.newMessage$.subscribe((newMessage: INewMessage) => {
            this.unReadMessages.push(newMessage);
        });

        this.clearMessageNavbar$.subscribe((senderId) => {
            var messages = this.unReadMessages.filter(c => c.senderId == senderId);

            this.auth.post("/api/Chat/readAllMessageConversation", senderId).subscribe((data: jsondata) => {
                if (data.success) {
                    messages.forEach(message => {
                        this.unReadMessages.splice(this.unReadMessages.indexOf(message), 1);
                    });
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });


        });
    }

    public addNewMessage(newMessage: INewMessage) {
        this.newMessage$.next(newMessage);
    }

    public clearUnReadMessage(senderId) {
        this.clearMessageNavbar$.next(senderId);
    }

    public getUnReadMessages() {
        this.auth.post("/api/Chat/getUnReadMessages").subscribe((data: jsondata) => {
            if (data.success) {
                this.unReadMessages = data.data;
            }
        });
    }

    public getLastUnreadsMessages(): ILastUnreadMessage[] {

        var lastMessages: ILastUnreadMessage[] = [];

        var senderIds: number[] = [];

        this.unReadMessages.forEach(message => {
            var senderId = senderIds.find(c => c == message.senderId);

            if (!senderId) {
                senderIds.push(message.senderId);
            }
        });

        senderIds.forEach(sid => {

            var messages = this.unReadMessages.filter(c => c.senderId == sid);

            lastMessages.push({
                totalCount: messages.length,
                lastNewMessage: messages[messages.length - 1]
            });

        });

        return lastMessages;
    }

}

export interface INewMessage {

    senderId: number;

    senderName: string;

    messageText: string;

    sendDate: string;
}

interface ILastUnreadMessage {
    lastNewMessage: INewMessage;

    totalCount: number;
}
