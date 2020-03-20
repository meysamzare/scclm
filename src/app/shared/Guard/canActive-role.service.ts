import { Injectable } from "@angular/core";
import {
    CanActivate,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
    Router,
    CanActivateChild
} from "@angular/router";
import { AuthService } from "../Auth/auth.service";
import { MessageService } from "../services/message.service";

@Injectable()
export class CanActiveRoleService implements CanActivateChild {
    constructor(
        private auth: AuthService,
        private router: Router,
        private message: MessageService
    ) { }

    canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (childRoute.data) {
            var roles: string[] = childRoute.data["role"];

            if (roles) {
                var userRole = this.auth.getUserRole();
                let id = childRoute.paramMap.get("id");
                // let bool = (userRole as any)[role];
                let canAccess;

                if (id) {
                    if (id == "0") {
                        canAccess = (userRole as any)[roles[0]];
                    } else {
                        canAccess = (userRole as any)[roles[1]];
                    }
                } else {
                    canAccess = (userRole as any)[roles[0]];
                }


                if (!canAccess) {
                    this.auth.noRoleAccess();
                }

                return canAccess;
            }

            return true;
        }
    }
}
