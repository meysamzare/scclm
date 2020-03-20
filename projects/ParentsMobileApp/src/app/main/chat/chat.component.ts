import { Component, OnInit } from '@angular/core';
import { IMobileChatConversation, MobileChatType } from 'projects/TeacherMobileApp/src/app/main/chats/mobile-chat';
import { MobileChatRepositoryService } from 'projects/TeacherMobileApp/src/app/main/chats/mobile-chat-repository.service';
import { StudentAuthService } from '../../service/parent-student-auth.service';
import { MatDialog } from '@angular/material';
import { SelectChatReciverDialogComponent } from './select-chat-reciver-dialog/select-chat-reciver-dialog.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    conversations: IMobileChatConversation[] = [];

    page = 1;
    search = "";

    totalCount = 0;

    agetntId = this.stdAuth.getStudent().id;
    agentType = MobileChatType.StudentParent;

    isLoading = false;

    constructor(
        public stdAuth: StudentAuthService,
        private mchatRep: MobileChatRepositoryService,
        private dialog: MatDialog,
        private router: Router
    ) { }

    ngOnInit() {
        this.refreshConversations(true);
    }

    refreshConversations(clear = false) {
        this.isLoading = true;

        if (clear) {
            this.conversations = [];
            this.page = 1;
        }

        this.mchatRep.GetConversations(this.page, this.agetntId, this.agentType, this.search, {
            type: 'View',
            agentId: this.stdAuth.getStudent().id,
            agentType: 'StudentParent',
            agentName: this.stdAuth.getStudentFullName(),
            tableName: 'View Chat Conversations',
            logSource: 'PMA',
            object: {
                page: this.page,
                id: this.agetntId,
                type: this.agentType,
                q: this.search
            },
        }).subscribe(data => {
            if (data.success) {

                var convers = data.data.conversations as IMobileChatConversation[];

                convers.forEach(conv => {
                    this.conversations.push(conv);
                });

                this.totalCount = data.data.count;
            } else {
                this.stdAuth.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.stdAuth.auth.handlerError(er);
        }, () => {
            this.isLoading = false;
        });
    }

    nextPage() {
        this.page += 1;

        this.refreshConversations();
    }

    canShowMoreButton(): boolean {
        var nowItemCount = this.conversations.length;
        var nowPage = this.page + 1;
        var totalItemCount = this.totalCount;

        if (nowItemCount < totalItemCount) {
            return true;
        }

        return false;
    }

    getTypeString(type) {
        var title = "";

        if (type == MobileChatType.StudentParent) {
            title += "والدین ";
        }

        if (type == MobileChatType.Teacher) {
            title += "دبیر ";
        }

        return title;
    }

    getClientNameByType(name, type: MobileChatType): string {
        var title = "";

        if (type == MobileChatType.StudentParent) {
            title += "والدین ";
        }

        if (type == MobileChatType.Teacher) {
            title += "دبیر ";
        }

        return title + name;
    }

    openChatReciverDialog() {
        const dialog = this.dialog.open(SelectChatReciverDialogComponent);

        dialog.afterClosed().subscribe(data => {
            if (data) {
                var id = data.id;
                var name = data.name;
                var type = data.type;

                this.router.navigate([`/chat/view/${id}/${type}/${name}`]);
            }
        });
    }

}
