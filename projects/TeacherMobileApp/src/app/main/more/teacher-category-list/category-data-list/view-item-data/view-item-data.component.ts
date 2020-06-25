import { Component, OnInit } from '@angular/core';
import { TeacherAuthService } from 'projects/TeacherMobileApp/src/app/services/teacher-auth.service';
import { ActivatedRoute } from '@angular/router';
import { IUnit } from 'src/app/Dashboard/unit/unit';
import { IItemAttr } from 'src/app/Dashboard/item/item-attr';
import { IAttr } from 'src/app/Dashboard/attribute/attribute';
import { IAttributeOption } from 'src/app/Dashboard/attribute/attribute-option';
import { ShowImageComponent } from 'src/app/shared/Modal/show-image.component';
import { MatDialog } from '@angular/material';
import { SetItemAttributeScoreComponent } from 'src/app/Dashboard/item/list/set-item-attribute-score/set-item-attribute-score.component';

@Component({
    selector: 'app-view-item-data',
    templateUrl: './view-item-data.component.html',
    styleUrls: ['./view-item-data.component.scss']
})
export class ViewItemDataComponent implements OnInit {


    Title = "";

    units: IUnit[] = [];
    attrs: IAttr[] = [];
    itemAttr: IItemAttr[] = [];
    item = null;

    itemId = 0;
    catId = 0;

    constructor(
        private tchAuth: TeacherAuthService,
        private activeRoute: ActivatedRoute,
        private dialog: MatDialog
    ) { 
        this.activeRoute.params.subscribe(params => {
            this.itemId = params["itemId"];
            this.catId = params["catId"];

            this.refreshData();
        });
    }

    ngOnInit() { 
        this.tchAuth.auth.post("/api/Unit/GetAll", null).subscribe(data => {
            if (data.success) {
                this.units = data.data;
            } else {
                this.tchAuth.auth.message.showMessageforFalseResult(data);
            }
        });
    }

    refreshData() {

        this.tchAuth.auth.post("/api/Item/getItem", this.itemId).subscribe(data => {
            if (data.success) {
                this.item = data.data.item;
                
                this.Title = `داده های ${this.item.title}`
            } else {
                this.tchAuth.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.tchAuth.auth.handlerError(er);
        });

        this.tchAuth.auth.post("/api/Item/getItemAttrForItem", this.itemId).subscribe(data => {
            if (data.success) {
                this.itemAttr = data.data;
            } else {
                this.tchAuth.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.tchAuth.auth.handlerError(er);
        });

        this.tchAuth.auth.post("/api/Attribute/getAttrsForCat", this.catId).subscribe(data => {
            if (data.success) {
                this.attrs = data.data;
            } else {
                this.tchAuth.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.tchAuth.auth.handlerError(er);
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
        let itemAttr = this.itemAttr.find(c => c.attributeId == attrId);


        if (itemAttr) {
            return itemAttr.attrubuteValue;
        }

        return "";
    }

    getScoreForAttr(attr: IAttr) {
        let itemAttr = this.itemAttr.find(c => c.attributeId == attr.id);

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
        var a = this.itemAttr.find(c => c.attributeId == attrId);

        if (a && a.attributeFilePath) {
            return this.tchAuth.auth.apiUrl + a.attributeFilePath.substr(1);
        }

        return "";
    }

    
    showPopupImage(imgUrl) {
        const dialog = this.dialog.open(ShowImageComponent, {
            data: {
                url: imgUrl
            }
        });
    }

    

    openSetItemAttributeScoreDialog(attr: IAttr) {
        let itemAttr = this.itemAttr.find(c => c.attributeId == attr.id);
        const dialog = this.dialog.open(SetItemAttributeScoreComponent, {
            data: {
                itemAttr: itemAttr,
                currentScore: itemAttr.scoreString,
                maxScore: attr.score
            }
        });

        dialog.afterClosed().subscribe((changed) => {
            if (changed) {
                this.refreshData();
            }
        });
    }

}
