import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/internal/operators/finalize';
import { IAttr } from 'src/app/Dashboard/attribute/attribute';
import { IAttributeOption } from 'src/app/Dashboard/attribute/attribute-option';
import { ICategory } from 'src/app/Dashboard/category/category';
import { IItemAttr } from 'src/app/Dashboard/item/item-attr';
import { SetItemAttributeScoreComponent } from 'src/app/Dashboard/item/list/set-item-attribute-score/set-item-attribute-score.component';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { ShowImageComponent } from 'src/app/shared/Modal/show-image.component';

@Component({
    selector: 'app-item-detail',
    templateUrl: './item-detail.component.html',
    styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit, OnChanges {

    @Input() ItemId = 0;
    @Input() CatId = 0;
    @Input() canSetScore = false;
    @Input() isFromDashboard = false;

    units = [];
    attrs: IAttr[] = [];
    itemAttrs: IItemAttr[] = [];
    cat = new ICategory();


    isLoading = false;

    constructor(
        private auth: AuthService,
        private dialog: MatDialog
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        this.refreshAllDatas();
    }

    ngOnInit() {
        this.refreshAllDatas();
    }

    refreshAllDatas() {
        this.refreshCat();
        this.refreshUnits();
        this.refreshDetailOfItem();
    }

    refreshCat() {
        this.auth.post("/api/Category/getCategory", this.CatId).subscribe(data => {
            if (data.success) {
                this.cat = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        });
    }

    refreshUnits() {
        this.auth.post("/api/Unit/GetAll").subscribe(data => {
            if (data.success) {
                this.units = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        });
    }


    refreshDetailOfItem() {
        this.isLoading = true;
        this.auth.post("/api/Item/getItemAttrForItem", this.ItemId).pipe(
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
        this.auth.post("/api/Attribute/getAttrsForCat", this.CatId).pipe(
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

        let attrs = this.attrs;

        if (this.cat.useLimitedRandomQuestionNumber) {
            let attrIds = this.itemAttrs.map(c => c.attributeId);
            attrs = attrs.filter(({ id }) => attrIds.includes(id));
        }

        return attrs.filter(c => c.unitId == unitId);
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

        let attrs = this.attrs;

        if (this.cat.useLimitedRandomQuestionNumber) {
            let attrIds = this.itemAttrs.map(c => c.attributeId);
            attrs = attrs.filter(({ id }) => attrIds.includes(id));
        }

        attrs.forEach(attr => {
            let attrScore = this.getScoreForAttr(attr);
            score += attrScore;
        });

        return score;
    }


    getSumScoreOfDietaleAttrs(): number {
        let score = 0;


        let attrs = this.attrs;

        if (this.cat.useLimitedRandomQuestionNumber) {
            let attrIds = this.itemAttrs.map(c => c.attributeId);
            attrs = attrs.filter(({ id }) => attrIds.includes(id));
        }

        attrs.forEach(attr => {
            if (attr.attrTypeInt == 6 || attr.attrTypeInt == 10 || attr.attrTypeInt == 11) {
                score += attr.score;
            }
        });

        return score;
    }

    getItemAttrUrlDietale(attrId): string {
        let itemAttr = this.itemAttrs.find(c => c.attributeId == attrId);

        if (itemAttr && itemAttr.attributeFilePath) {
            return this.auth.apiUrl + itemAttr.attributeFilePath.substr(1);
        }

        return "";
    }


    showPopupImage(imgUrl) {
        this.dialog.open(ShowImageComponent, {
            data: {
                url: imgUrl
            }
        });
    }


    openSetItemAttributeScoreDialog(attr: IAttr) {
        let itemAttr = this.itemAttrs.find(c => c.attributeId == attr.id);
        const dialog = this.dialog.open(SetItemAttributeScoreComponent, {
            data: {
                itemAttr: itemAttr,
                currentScore: itemAttr.scoreString,
                maxScore: attr.score
            }
        });

        dialog.afterClosed().subscribe((changed) => {
            if (changed) {
                this.refreshDetailOfItem();
            }
        });
    }

}
