import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { EMPTY, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ViewGalleryResolveService implements Resolve<any>{

    constructor(
		private auth: AuthService,
		private message: MessageService,
		private router: Router
	) { }


	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		let id = route.params["id"];

		if (id) {
			if (id == 0) {
				return EMPTY;
			}

			return this.auth.post("/api/Picture/getAllByGallery", id).pipe(
				take(1),
				mergeMap((data: jsondata) => {
					if (data.success) {
						return of(data.data);
					} else {
						this.message.showMessageforFalseResult(data);
						this.router.navigate(["/"]);
						return EMPTY;
					}
				})
			);

		} else {
			this.router.navigate(["/"]);
			return EMPTY;
		}
	}
}
