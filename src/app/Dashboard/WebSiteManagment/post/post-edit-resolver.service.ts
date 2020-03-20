import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { of, EMPTY } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { IPost } from './post';
import { IMainSlideShow } from '../main-slide-show/main-slide-show';
import { ISchedule } from '../schedule/schedule';

@Injectable({
    providedIn: 'root'
})
export class PostEditResolverService implements Resolve<any>{

    constructor(
        private auth: AuthService,
        private message: MessageService,
        private router: Router
    ) { }


    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id = route.params["id"];

        if (id) {
            if (id == 0) {

                let title = "post";
                if (await this.auth.draft.isAnyDraft(title)) {
                    return JSON.parse((await this.auth.draft.getDraft(title)).value);
                }

                return of({
                    post: new IPost(),
                    mainslideshow: new IMainSlideShow(),
                    schedule: new ISchedule(),
                }).toPromise();
            }

            return this.auth.post("/api/Post/getPost", id).pipe(
                take(1),
                mergeMap((data: jsondata) => {
                    if (data.success) {

                        let post = data.data;

                        return of({
                            post: post,
                            mainslideshow: new IMainSlideShow(),
                            schedule: new ISchedule(),
                        });

                    } else {
                        this.message.showMessageforFalseResult(data);
                        this.router.navigate(["/"]);
                        return EMPTY;
                    }
                })
            ).toPromise();

        } else {
            this.router.navigate(["/"]);
            return EMPTY.toPromise();
        }
    }
}
