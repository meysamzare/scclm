import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IItemAttr } from 'src/app/Dashboard/item/item-attr';
import { IAttr } from 'src/app/Dashboard/attribute/attribute';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { IAttributeOption } from 'src/app/Dashboard/attribute/attribute-option';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-view-cat-detail',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './view-cat-detail.component.html',
    styleUrls: ['./view-cat-detail.component.scss']
})
export class ViewCatDetailComponent implements OnInit {

    catId = 0;
    catName = "";
    itemId = 0;

    itemAttrs: IItemAttr[] = [];
    attrs: IAttr[] = [];

    units = [];

    isLoading = false;

    constructor(
        private activeRoute: ActivatedRoute,
        private auth: AuthService
    ) { }

    ngOnInit() {

        this.auth.post("/api/Unit/GetAll").subscribe(data => {
            if (data.success) {
                this.units = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        });

        this.activeRoute.params.subscribe(param => {
            this.catId = param["catId"];
            this.itemId = param["itemId"];
            this.catName = param["catName"];

            this.refreshDetailOfItem();
        });
    }

    refreshDetailOfItem() {

        this.isLoading = true;
        this.auth.post("/api/Item/getItemAttrForItem", this.itemId).pipe(
            finalize(() => this.isLoading = false)
        ).subscribe(data => {
            if (data.success) {
                this.itemAttrs = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

        this.isLoading = true;
        this.auth.post("/api/Attribute/getAttrsForCat", this.catId).pipe(
            finalize(() => this.isLoading = false)
        ).subscribe(data => {
            if (data.success) {
                this.attrs = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    getAttrsForUnit(unitId): any[] {
        return this.attrs.filter(c => c.unitId == unitId);
    }


    getShiftedItem(attr: IAttr) {
        let options: IAttributeOption[] = (attr as any).attributeOptions || [];

        return options;
    }

    getItemAttrValDietale(attrId): string {
        let itemAttr = this.itemAttrs.find(c => c.attributeId == attrId);


        if (itemAttr) {
            return itemAttr.attrubuteValue;
        }

        return "";
    }

    getScoreForAttr(attr: IAttr) {
        let itemAttr = this.itemAttrs.find(c => c.attributeId == attr.id);

        if (itemAttr) {
            return itemAttr.scoreString;
        }

        return 0;
    }

    getTotalScoreOfDietale(): number {
        let score = 0;

        this.attrs.forEach(attr => {
            let attrScore = this.getScoreForAttr(attr);
            score += attrScore;
        });

        return score;
    }

    
    getSumScoreOfDietaleAttrs(): number {
        let score = 0;

        this.attrs.forEach(attr => {
            if (attr.attrTypeInt == 6 || attr.attrTypeInt == 10 || attr.attrTypeInt == 11) {
                score += attr.score;
            }
        });

        return score;
    }
    
    getItemAttrUrlDietale(attrId): string {
        var a = this.itemAttrs.find(c => c.attributeId == attrId);

        if (a && a.attributeFilePath) {
            return this.auth.apiUrl + a.attributeFilePath.substr(1);
        }

        return "";
    }

    
    showPopupImage(imgUrl) {
        // const dialog = this.dialog.open(ShowImageComponent, {
        //     data: {
        //         url: imgUrl
        //     }
        // });
    }

}
