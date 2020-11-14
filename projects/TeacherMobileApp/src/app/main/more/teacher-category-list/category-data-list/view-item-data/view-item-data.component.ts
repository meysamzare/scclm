import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUnit } from 'src/app/Dashboard/unit/unit';
import { IItemAttr } from 'src/app/Dashboard/item/item-attr';
import { IAttr } from 'src/app/Dashboard/attribute/attribute';

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
    itemTitle = 0;
    catId = 0;

    constructor(
        private activeRoute: ActivatedRoute
    ) { 
        this.activeRoute.params.subscribe(params => {
            this.itemId = params["itemId"];
            this.catId = params["catId"];
            this.itemTitle = params["itemTitle"];

            this.Title = `داده های ${this.itemTitle}`;
        });
    }

    ngOnInit() { }

}
