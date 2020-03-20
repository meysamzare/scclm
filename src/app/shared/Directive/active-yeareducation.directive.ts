import { Directive, Input, ViewChildren, AfterViewInit } from '@angular/core';
import { AuthService } from '../Auth/auth.service';
import { NgModel } from '@angular/forms';

@Directive({
    selector: "[activeyear]"
})
export class ActiveYeareducationDirective implements AfterViewInit {


    KEY = "_acyear";

    @Input("activeyear") public isEdit: boolean;

    constructor(
        private auth: AuthService,
        public model: NgModel
    ) {

    }

    ngAfterViewInit(): void {
        if (this.isEdit === false) {
            this.updateYeareducationId();
        }
    }

    updateYeareducationId() {
        this.auth.post("/api/Dashboard/getActiveYeareducationId").subscribe(data => {
            if (data.success) {
                this.setActiveYearId(data.data);

                this.setNewModelValue(this.getActiveYearId());
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    setActiveYearId(id): void {
        localStorage.setItem(this.KEY, id);
    }

    getActiveYearId(): number | null {
        var item = localStorage.getItem(this.KEY);

        if (item) {
            return +item;
        }

        return null;
    }

    setNewModelValue(value) {
        this.model.viewToModelUpdate(value);
        this.model.valueAccessor.writeValue(value);
        this.model.reset(value);
    }

}
