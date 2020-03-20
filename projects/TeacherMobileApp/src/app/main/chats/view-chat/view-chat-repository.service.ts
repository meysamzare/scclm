import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TeacherAuthService } from '../../../services/teacher-auth.service';
import { MobileChatRepositoryService } from '../mobile-chat-repository.service';
import { MobileChatType } from '../mobile-chat';
import { take, mergeMap, debounceTime } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ViewChatRepositoryService implements Resolve<any> {

    constructor(
        private tchAuth: TeacherAuthService,
        private mChatRep: MobileChatRepositoryService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        var clientId = route.params["Cid"];
        var clientType = route.params["Ctype"];
        var clientName = route.params["name"];

        var page = 1;

        return this.mChatRep.GetChats(this.tchAuth.getTeacherId(), MobileChatType.Teacher, clientId, clientType, page, {
            type: 'View',
            agentId: this.tchAuth.getTeacherId(),
            agentType: 'Teacher',
            agentName: this.tchAuth.getTeacherName(),
            tableName: 'Entring ViewChat Page',
            logSource: 'TMA',
            object: {
                teacherId: this.tchAuth.getTeacherId(),
                Type: MobileChatType.Teacher,
                ClientId: clientId,
                ClientType: clientType,
                ClientName: clientName,
                Page: page
            },
        }).pipe(
            take(1),
            mergeMap(data => {
                if (data.success) {
                    return of({
                        chats: data.data.chats,
                        totalCount: data.data.totalCount
                    });
                } else {
                    return EMPTY;
                }
            })
        );
    }

}
