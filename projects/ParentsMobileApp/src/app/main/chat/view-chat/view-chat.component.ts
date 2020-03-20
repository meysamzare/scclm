import { Component, OnInit } from '@angular/core';
import { MobileChatType, IMobileChat } from 'projects/TeacherMobileApp/src/app/main/chats/mobile-chat';
import { StudentAuthService } from '../../../service/parent-student-auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MobileChatRepositoryService } from 'projects/TeacherMobileApp/src/app/main/chats/mobile-chat-repository.service';
import { debounceTime } from 'rxjs/operators';
import { MainService } from '../../main/main.service';

@Component({
  selector: 'app-view-chat',
  templateUrl: './view-chat.component.html',
  styleUrls: ['./view-chat.component.scss']
})
export class ViewChatComponent implements OnInit {

    clientId = 0;
    clientType: MobileChatType = MobileChatType.StudentParent;
    clientName = "";

    agentId = this.stdAuth.getStudent().id;
    agentType = MobileChatType.StudentParent;
    agentName = this.stdAuth.getStudentFullName();

    page = 1;

    totalCount = 0;

    chats: IMobileChat[] = [];

    Chat: IMobileChat = new IMobileChat();

    Title = "";

    scrollUp$;

    isSendingChat = false;

    constructor(
        public stdAuth: StudentAuthService,
        private activeRoute: ActivatedRoute,
        private mChatRep: MobileChatRepositoryService,
        private mainServ: MainService,
        private router: Router
    ) {
        this.activeRoute.params.subscribe(params => {
            this.activeRoute.data.subscribe(data => {

                this.totalCount = data.chats.totalCount;

                var chats = data.chats.chats as IMobileChat[];

                // if (this.totalCount == 0) {
                //     this.router.navigateByUrl("/");

                //     this.stdAuth.auth.message.showWarningAlert("شما مجوز ارسال پیام را ندارید")
                // }

                chats.forEach(chat => {
                    this.chats.unshift(chat);
                });
            });

            this.clientId = params["Cid"];
            this.clientType = params["Ctype"];
            this.clientName = params["name"];

            this.Chat.senderId = this.agentId;
            this.Chat.senderName = this.agentName;
            this.Chat.senderType = this.agentType;

            this.Chat.reciverId = this.clientId;
            this.Chat.reciverName = this.clientName;
            this.Chat.reciverType = this.clientType;

            this.Chat.fileData = "";


            this.Title = this.getTitle();

            this.mChatRep.setAllChatSeen(this.agentId, this.agentType, this.clientId, this.clientType, {
                type: 'View',
                agentId: this.stdAuth.getStudent().id,
                agentType: 'StudentParent',
                agentName: this.stdAuth.getStudentFullName(),
                tableName: 'Entring View Chats Page',
                logSource: 'PMA',
                object: {
                    clientId: this.clientId,
                    clientType: this.clientType,
                    clientName: this.clientName,
                    Title: this.Title
                },
            }).subscribe(data => {
                if (data.success) {
                } else {
                    this.stdAuth.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.stdAuth.auth.handlerError(er);
            });

            this.scrollUp$ = this.mainServ.mainDivScrollTop$
                .pipe(
                    debounceTime(1000)
                ).subscribe(() => {
                    if (this.canShowMoreButton()) {
                        this.nextPage();
                    }
                });
        });
    }


    ngOnInit() {
    }

    ngAfterViewChecked() {
    }

    ngAfterViewInit(): void {
        this.scrollToBottom();
    }

    ngOnDestroy(): void {
        this.scrollUp$.unsubscribe();
    }


    clearChat() {
        this.Chat.text = "";
        this.Chat.fileData = "";
        this.Chat.fileName = "";
    }

    scrollToBottom(): void {
        var mainElement = document.getElementById("main");
        mainElement.scrollTop = mainElement.scrollHeight + 20;
    }

    refreshChats(clear = false, scroll: "none" | "bottom" | "half" = "none") {

        if (clear) {
            this.page = 1;
        }

        this.mChatRep.GetChats(this.agentId, this.agentType, this.clientId, this.clientType, this.page, {
            type: 'View',
            agentId: this.stdAuth.getStudent().id,
            agentType: 'StudentParent',
            agentName: this.stdAuth.getStudentFullName(),
            tableName: 'View Chats',
            logSource: 'PMA',
            object: {
                id: this.agentId,
                type: this.agentType,
                clientId: this.clientId,
                clientType: this.clientType,
                page: this.page,
                clear: clear,
                scroll: scroll
            },
        }).subscribe(data => {
            if (data.success) {

                if (clear) {
                    this.chats = [];
                }

                this.totalCount = data.data.totalCount;

                var chats = data.data.chats as IMobileChat[];

                chats.forEach(chat => {
                    this.chats.unshift(chat);
                });

            } else {
                this.stdAuth.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.stdAuth.auth.handlerError(er);
        }, () => {
            if (scroll == "bottom") {
                this.scrollToBottom();
            }

            if (scroll == "half") {
                var mainElement = document.getElementById("main");
                mainElement.scrollTop = 70;
            }
        });
    }

    getTitle(): string {
        var title = "گفتگو با ";

        if (this.clientType == MobileChatType.Teacher) {
            title += "دبیر ";
        }

        if (this.clientType == MobileChatType.StudentParent) {
            title += "اولیای دانش آموز ";
        }

        title += this.clientName;

        return title;
    }

    getReciverName(): string {
        var title = "";

        if (this.clientType == MobileChatType.Teacher) {
            title += "دبیر ";
        }

        if (this.clientType == MobileChatType.StudentParent) {
            title += "اولیای دانش آموز ";
        }

        title += this.clientName;

        return title;
    }




    onFileChanged(event) {
        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            if (file.size / 1024 / 1024 > 2) {
                return this.stdAuth.auth.message.showWarningAlert(
                    "حجم فایل باید کمتر از 2 مگا بایت باشد",
                    "اخطار"
                );
            }
            reader.readAsDataURL(file);
            reader.onload = () => {
                let result = reader.result.toString().split(",")[1];
                this.Chat.fileName = file.name;
                this.Chat.fileData = result;
            };
        } else {
            this.Chat.fileData = "";
            this.Chat.fileName = "";
        }
    }

    clearFile() {
        this.Chat.fileData = "";
        this.Chat.fileName = "";
    }


    sendChat() {
        this.isSendingChat = true;
        this.mChatRep.AddChat(this.Chat, {
            type: 'Add',
            agentId: this.stdAuth.getStudent().id,
            agentType: 'StudentParent',
            agentName: this.stdAuth.getStudentFullName(),
            tableName: 'Send Chat',
            logSource: 'PMA',
            object: {
                chat: this.Chat
            },
        }).subscribe(data => {
            if (data.success) {
                this.refreshChats(true, "bottom");

                this.clearChat();
            } else {
                this.stdAuth.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.stdAuth.auth.handlerError(er);
        }, () => {
            this.isSendingChat = false;
        });
    }

    nextPage() {
        this.page += 1;

        this.refreshChats(false, "half");
    }

    canShowMoreButton(): boolean {
        var nowItemCount = this.chats.length;
        var nowPage = this.page + 1;
        var totalItemCount = this.totalCount;

        if (nowItemCount < totalItemCount) {
            return true;
        }

        return false;
    }

    detectIsSender(chat: IMobileChat): boolean {
        if (chat.senderId == this.agentId && chat.senderType == this.agentType) {
            return true;
        }

        return false;
    }

}
