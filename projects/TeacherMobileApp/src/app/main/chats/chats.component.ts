import { Component, OnInit } from '@angular/core';
import { IMobileChatConversation, MobileChatType } from './mobile-chat';
import { TeacherAuthService } from '../../services/teacher-auth.service';
import { MobileChatRepositoryService } from './mobile-chat-repository.service';

@Component({
    selector: 'app-chats',
    templateUrl: './chats.component.html',
    styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {

    conversations: IMobileChatConversation[] = [];

    page = 1;
    search = "";

    totalCount = 0;

    agetntId = this.tchAuth.getTeacherId();
    agentType = MobileChatType.Teacher;

    isLoading = false;

    constructor(
        public tchAuth: TeacherAuthService,
        private mchatRep: MobileChatRepositoryService
    ) { }

    ngOnInit() {
        this.refreshConversations(true);
    }

    refreshConversations(clear = false) {
        this.isLoading = true;
        this.mchatRep.GetConversations(this.page, this.agetntId, this.agentType, this.search, {
            type: 'View',
            agentId: this.tchAuth.getTeacherId(),
            agentType: 'Teacher',
            agentName: this.tchAuth.getTeacherName(),
            tableName: 'View Chat Conversations (Get Method)',
            logSource: 'TMA',
            object: {
                page: this.page,
                agetntId: this.agetntId,
                agentType: this.agentType,
                search: this.search
            }
        }).subscribe(data => {
            if (data.success) {

                if (clear) {
                    this.conversations = [];
                    this.page = 1;
                }

                var convers = data.data.conversations as IMobileChatConversation[];

                convers.forEach(conv => {
                    this.conversations.push(conv);
                });

                this.totalCount = data.data.count;
            } else {
                this.tchAuth.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.tchAuth.auth.handlerError(er);
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

}
