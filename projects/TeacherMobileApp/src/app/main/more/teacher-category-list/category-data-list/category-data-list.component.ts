import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeacherAuthService } from 'projects/TeacherMobileApp/src/app/services/teacher-auth.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AttrValSearch } from 'src/app/Dashboard/item/attr-val-search';
import { IAttr } from 'src/app/Dashboard/attribute/attribute';
import { IAttributeOption } from 'src/app/Dashboard/attribute/attribute-option';

@Component({
    selector: 'app-category-data-list',
    templateUrl: './category-data-list.component.html',
    styleUrls: ['./category-data-list.component.scss']
})
export class CategoryDataListComponent implements OnInit {

    page = 0
    searchText = "";

    catTitle = "";
    catId = 0;
    Type = 0;

    Title = "";

    Items = [];
    totalCount = 0;

    searchAttrVals: AttrValSearch[] = [];
    searchedAttrs: IAttr[] = [];

    search$ = new Subject();

    constructor(
        private tchAuth: TeacherAuthService,
        private activeRoute: ActivatedRoute,
    ) {
        this.search$.pipe(
            debounceTime(400)
        ).subscribe(() => {
            this.refreshData(true);
        });
    }

    ngOnInit() {
        this.activeRoute.params.subscribe(params => {
            this.catTitle = params["catTitle"];
            this.catId = params["catId"];
            this.Type = params["Type"];

            this.Title = `لیست ${this.catTitle}`;

            this.searchAttrVals = [];

            this.tchAuth.auth
                .post("/api/Category/getSearchedAttrs", this.catId)
                .subscribe(data => {
                    if (data.success) {
                        this.searchedAttrs = data.data;
                    } else {
                        this.tchAuth.auth.message.showMessageforFalseResult(data);
                    }
                });

            this.refreshData(true);
        });
    }

    
    getShiftedItem(attr: IAttr) {
        let options: IAttributeOption[] = (attr as any).attributeOptions || [];

        return options;
    }

    addSearchAttrValForSelect(attrId, event) {
        let val = event;

        var i = this.searchAttrVals.find(c => c.attrId == attrId);

        if (i) {
            if (val === "") {
                this.searchAttrVals.splice(this.searchAttrVals.indexOf(i), 1);
            }
            i.val = val;
        } else {
            if (val != "") {
                this.searchAttrVals.push({
                    attrId: attrId,
                    val: val
                });
            }
        }

        this.searchChange();
    }

    
    addSearchAttrVal(attrId, event) {
        let val;
        if (event.target) {
            val = event.target.value;
        } else {
            val = event.checked;
        }

        var i = this.searchAttrVals.find(c => c.attrId == attrId);

        if (i) {
            if (val === "") {
                this.searchAttrVals.splice(this.searchAttrVals.indexOf(i), 1);
            }
            i.val = val;
        } else {
            this.searchAttrVals.push({
                attrId: attrId,
                val: val
            });
        }

        this.searchChange();
    }

    getSearchAttrVal(attrId) {
        var i = this.searchAttrVals.find(c => c.attrId == attrId);

        if (i) {
            return i.val;
        } else {
            return "";
        }
    }

    clearSearchAttrVals() {
        this.searchAttrVals = [];
        this.searchChange();
    }


    searchChange() {
        this.search$.next();
    }

    nextPage() {
        this.page += 1;

        this.refreshData();
    }


    canShowMoreButton(): boolean {
        let nowItemCount = this.Items.length;
        let totalItemCount = this.totalCount;

        if (nowItemCount < totalItemCount) {
            return true;
        }

        return false;
    }


    isLoading = false;

    refreshData(clearListThenAdd = false) {
        let obj = {
            param: {
                sort: "",
                direction: "",
                pageIndex: this.page,
                pageSize: 5,
                q: this.searchText
            },
            catId: this.catId,
            attrvalsearch: this.searchAttrVals,
            state: "both",
            Type: this.Type
        };

        this.isLoading = true;
        this.tchAuth.auth.post("/api/Item/Get", obj, {
            type: 'View',
            agentId: this.tchAuth.getTeacherId(),
            agentType: 'Teacher',
            agentName: this.tchAuth.getTeacherName(),
            tableName: 'View Category Item List (Get Param)',
            logSource: 'TMA',
            object: obj,
        }).pipe(
            finalize(() => this.isLoading = false)
        ).subscribe(data => {
            if (data.success) {

                if (clearListThenAdd) {
                    this.Items = [];
                }

                this.totalCount = +data.type;

                let items: any[] = data.data;

                items.forEach(item => this.Items.push(item));

            } else {
                this.tchAuth.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.tchAuth.auth.handlerError(er);
        });
    }

}
