import { Directive, Input } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Directive({
    selector: '[uniqAttr]'
})
export class UniqAttrValueValidatorDirective implements AsyncValidator {

    @Input("uniqAttr") canValidate = false;
    @Input("attrId") attrId = 0;
    @Input("catId") catId = 0;

    constructor(
        private auth: AuthService
    ) { }

    validate(control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> {
        if (this.canValidate) {
            return this.isAttrUniqValueExist(control.value);
        }
    }

    registerOnValidatorChange?(fn: () => void): void {

    }

    async isAttrUniqValueExist(value: any) {
        try {
            const data = await this.auth.post("/api/Item/CheckForUniqAttr", {
                catId: this.catId,
                attrId: this.attrId,
                val: value
            }).toPromise();


            return data.success ? { 'uniqValue': { value: value } } : null;
        } catch {
            return null;
        }
    }

}
