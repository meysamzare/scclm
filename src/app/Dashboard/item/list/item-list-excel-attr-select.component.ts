import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { IAttr } from "../../attribute/attribute";
import { AuthService, jsondata } from "src/app/shared/Auth/auth.service";
import { MessageService } from "src/app/shared/services/message.service";

@Component({
    templateUrl: "./item-list-excel-attr-select.component.html"
})
export class ItemListExcelAttrSelectComponent {
    attrs: IAttr[] = [];

    selectedAttrs: IAttr[] = [];

    constructor(
        public dialogRef: MatDialogRef<ItemListExcelAttrSelectComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
		private auth: AuthService,
		private message: MessageService
    ) {
        this.auth.post("/api/Attribute/getAttrsForCat", data.catId).subscribe(
            (data: jsondata) => {
                if (data.success) {
                    this.attrs = data.data;
                } else {
                    this.message.showMessageforFalseResult(data);
                }
            },
            er => {
                this.auth.handlerError(er);
            }
        );
	}
	
	pushSelectedAttrs(check, attrId) {
		var sattr = this.selectedAttrs.find(c => c.id == attrId);

		if (sattr) {
			if (!check) {
				this.selectedAttrs.splice(this.selectedAttrs.indexOf(sattr), 1);
			}
		} else {
			if (check) {
				this.selectedAttrs.push(this.attrs.find(c => c.id == attrId));
			}
		}
	}
}
