import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { StudentAuthService } from '../../../service/parent-student-auth.service';
import { MobileChatRepositoryService } from 'projects/TeacherMobileApp/src/app/main/chats/mobile-chat-repository.service';
import { MobileChatType } from 'projects/TeacherMobileApp/src/app/main/chats/mobile-chat';
import { take, mergeMap } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ViewChatRepositoryService implements Resolve<any> {

    constructor(
        private stdAuth: StudentAuthService,
        private mChatRep: MobileChatRepositoryService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        var clientId = route.params["Cid"];
        var clientType = route.params["Ctype"];
        var clientName = route.params["name"];

        var page = 1;

        return this.mChatRep.GetChats(this.stdAuth.getStudent().id, MobileChatType.StudentParent, clientId, clientType, page)
            .pipe(
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
