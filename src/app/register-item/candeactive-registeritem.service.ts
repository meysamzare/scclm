import { Injectable } from "@angular/core";
import {
    CanDeactivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from "@angular/router";
import { RegisterItemComponent } from "./register-item.component";

@Injectable()
export class CanDeActiveRegisterItem
    implements CanDeactivate<RegisterItemComponent> {
    canDeactivate(
        component: RegisterItemComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot
    ): boolean {
        if (component.isFormDirty()) {
            return confirm("آیا از خروج اطمینان دارید؟");
        }
        return true;
    }
}
