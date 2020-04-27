import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import * as emoji from "emoji-images";
import { IChat } from "./chat";
import { SignalRService } from "src/app/shared/services/signalr.service";
import { IUser } from "../user/user";
import { ChatService, INewMessage } from "src/app/shared/services/chat.service";
import { NgForm } from "@angular/forms";

declare var $: any;

interface IWindow extends Window {
    EmojiPicker: any;
    emojiPicker: any;
}
declare global {
    interface Window { emojiPicker: any; }
}

@Component({
    templateUrl: "./chat.component.html",
    styles: [
        `
            #textarea {
                -moz-appearance: textfield-multiline;
                -webkit-appearance: textarea;
                border: 1px solid gray;
                overflow: auto;
                padding: 15px;
                border-radius: 10px;
                margin: 10px;
                font-size: 14px;
			}
			
			.gray-back {
                background-color: lightgrey;
            }
            .active{
                background-color: lightgrey;
            }
        `
    ]
})
export class ChatComponent implements AfterViewInit, OnInit, OnDestroy {


    chat: IChat = new IChat();

    chats: IChat[] = [];

    page = 1;

    users: IUser[];

    activeUserId = 0;
    activeUserUserName = "";

    isLoading = true;

    lastMessageDate = "........";

    @ViewChild("fm1", { static: true }) fm1: NgForm;

    constructor(
        public router: Router,
        public activeRoute: ActivatedRoute,
        private message: MessageService,
        public auth: AuthService,
        public hubSrvc: SignalRService,
        private chatSrv: ChatService
    ) {
        this.chatSrv.newMessage$.subscribe((newMessage: INewMessage) => {
            if (newMessage.senderId == this.activeUserId) {
                this.refreshChats(this.activeUserId, this.activeUserUserName, true);
                this.chatSrv.clearUnReadMessage(newMessage.senderId);
            }
        });
    }

    ngOnDestroy(): void {
        if (this.fm1.dirty && !this.fm1.submitted) {
            let title = "chatText";
            if (this.chat.text) {
                this.auth.draft.setDraft({
                    title: title,
                    value: this.chat.text
                });
            } else {
                this.auth.draft.removeDraft(title);
            }
        }
    }

    clearDraft() {
        let title = "chatText";
        this.auth.draft.removeDraft(title);
    }

    async ngOnInit() {
        this.resetChat();

        this.auth.post("/api/User/getUsersChat", null, {
            type: 'View',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Entring To Chat Page',
            logSource: 'dashboard',
            object: null,
            table: "Chat"
        }).subscribe((data: jsondata) => {
            if (data.success) {
                this.users = data.data;

                this.isLoading = false;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

        this.auth.post("/api/Chat/getLastMessageDate").subscribe(data => {
            if (data.success) {
                if (data.data) {
                    this.lastMessageDate = data.data;
                }
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

        let title = "chatText";
        if (await this.auth.draft.isAnyDraft(title)) {
            this.chat.text = (await this.auth.draft.getDraft(title)).value;
        }
    }


    resetChat() {
        this.chat.text = "";
        this.chat.senderId = this.auth.getUserId();
        this.chat.fileStatus = false;
        this.chat.fileData = "";

        var user = this.auth.getUser();

        this.chat.senderFullName = user.firstname + " " + user.lastname;

    }


    ngAfterViewInit(): void {
        // const { EmojiPicker }: IWindow = <IWindow><any>window;

        // window.emojiPicker = new EmojiPicker({
        //     emojiable_selector: '[data-emojiable=true]',
        //     assetsPath: '/assets/base/emoji-picker-master/lib/img',
        //     popupButtonClasses: 'fa fa-smile-o'
        // });

        // window.emojiPicker.discover();
    }

    emojiSelected(event) {
        var e = event.emoji;

        var emojified = emoji(e.colons, "/emoji", 22);

        $("#textarea").append(emojified);
    }

    refreshChats(cid, username, resetpage = false) {
        this.activeUserId = cid;
        this.activeUserUserName = username;

        this.chat.reciverId = cid;

        this.chatSrv.clearUnReadMessage(cid);


        if (resetpage) {
            this.page = 1;
        }

        this.auth.post("/api/Chat/Get", {
            page: this.page,
            clientId: cid
        }, {
            type: 'View',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Chat Messages',
            logSource: 'dashboard',
            object: {
                page: this.page,
                clientId: cid
            },
            table: "Chat"
        }).subscribe((data: jsondata) => {
            if (data.success) {
                if (resetpage) {
                    this.chats = data.data;
                } else {
                    var chatss: IChat[] = data.data;
                    chatss.forEach(chat => {
                        this.chats.push(chat);
                    });
                }

            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    onDivScroll(event) {

        if ($('#chatcon').scrollTop() + $('#chatcon').innerHeight() >= $('#chatcon')[0].scrollHeight) {

            this.page += 1;

            this.refreshChats(this.activeUserId, this.activeUserUserName);
        }
    }

    sendMessage() {
        this.auth.post("/api/Chat/addChat", this.chat, {
            type: 'Add',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: 'Chat',
            logSource: 'dashboard',
            object: this.chat,
            table: "Chat",
            tableObjectIds: [this.chat.reciverId]
        }).subscribe((data: jsondata) => {
            if (data.success) {

                this.hubSrvc.hubConnection.invoke("SendChatMessage",
                    this.activeUserUserName, {
                    senderId: this.auth.getUserId(),
                    senderName: this.chat.senderFullName,
                    messageText: this.chat.text,
                    sendDate: data.data
                });

                this.refreshChats(this.activeUserId, this.activeUserUserName, true);

                this.resetChat();
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    getUserUnReadMessagesInt(senderId): number {
        var unreadmsg = this.chatSrv.unReadMessages.filter(c => c.senderId == senderId);

        if (unreadmsg) {
            return unreadmsg.length;
        }

        return 0;
    }
}
