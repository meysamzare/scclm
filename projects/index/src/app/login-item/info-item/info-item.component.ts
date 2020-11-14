import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ICategory } from 'src/app/Dashboard/category/category';
import { IItem } from 'src/app/Dashboard/item/item';
import { IAttr } from 'src/app/Dashboard/attribute/attribute';
import { IItemAttr } from 'src/app/Dashboard/item/item-attr';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { LogService } from 'src/app/shared/services/log.service';
import { IAttributeOption } from 'src/app/Dashboard/attribute/attribute-option';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-info-item',
    templateUrl: './info-item.component.html',
    styleUrls: ['./info-item.component.scss'],
    styles: [`
			h3 {
				font-size: 17px !important;
			}
			@media print {
				
				a.btn {
					display: none;
				}
				notifier__notification-message.ng-star-inserted {
					display: none;
				}
				@page {
					size: A5;
				}

				div.loginColumns {
					padding: 0;
				}
			}
			@page {
				size: A5;
				margin: 10%;
			}
	`]
})
export class InfoItemComponent implements OnInit, AfterViewInit {
    catId;
    type: any = "1";

    category: ICategory = new ICategory();

    Item: IItem = new IItem();

    itemId;

    attrs: IAttr[] | any[] = [];

    itemattrs: IItemAttr[] = [];

    rahCode: string;

    ItemDataKEY: string = "_ie";

    loadItemAttr = false;

    isLoading = true;

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private auth: AuthService,
        private message: MessageService,
        private log: LogService
    ) {

        this.activeRoute.params.subscribe(params => {
            this.catId = params["catId"];
            this.rahCode = params["rahcode"];
            this.type = params["type"];

            this.Item = this.activeRoute.snapshot.data.item;

            let itemData = JSON.parse(localStorage.getItem(this.ItemDataKEY));

            if (itemData) {
                var nowDate = new Date();
                if (nowDate > new Date(Date.parse(itemData.date))) {
                    localStorage.removeItem(this.ItemDataKEY);
                    this.router.navigate(["/"]);
                }

                if (this.catId != itemData.catId) {
                    this.router.navigate(["/"]);
                }

                if (this.rahCode != itemData.rahCode) {
                    this.router.navigate(["/"]);
                }
            } else {
                this.router.navigate(["/"]);
            }


            this.auth.post("/api/Category/getCategory", this.catId).subscribe(data => {
                if (data.success) {
                    this.category = data.data;

                    if (!this.category.haveInfo) {
                        this.router.navigate(["/"]);
                    }
                    if (!this.category.isInfoShow) {
                        this.router.navigate(["/"]);
                    }

                    if (this.type == 2) {

                        // this.log.Log("Entring to printing page", "Entring to printing page for cat: " + this.category.title + " with rahcode: " + this.rahCode);
                    } else {
                        // this.log.Log("Entring to result page", "Entring to result page for cat: " + this.category.title + " with rahcode: " + this.rahCode);
                    }
                } else {
                    this.message.showMessageForSuccessResult(data);
                    this.router.navigate(["/"]);
                }
            }, er => {
                this.auth.handlerError(er);
                this.router.navigate(["/"]);
            });

        });
    }

    ngOnInit(): void {

        this.auth.post("/api/Item/getItemShowInfoAttr", this.Item.id).subscribe(data => {
            if (data.success) {
                this.attrs = data.data;
            } else {
                this.router.navigate(["/"]);
            }
        }, er => {
            this.auth.handlerError(er);
            this.router.navigate(["/"]);
        });

        this.auth.post("/api/Item/getItemAttrForItem", this.Item.id)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe(data => {
                if (data.success) {
                    this.itemattrs = data.data;
                    this.loadItemAttr = false;
                } else {
                    this.message.showMessageforFalseResult(data);
                    this.loadItemAttr = false;
                    this.router.navigate(["/"]);
                }
                this.loadItemAttr = false;
            }, er => {
                this.auth.handlerError(er);
                this.loadItemAttr = false;
                this.router.navigate(["/"]);
            });
    }

    ngAfterViewInit(): void {
    }


    getShiftedItem(attr: IAttr) {
        let options: IAttributeOption[] = (attr as any).attributeOptions || [];

        return options;
    }

    getItemAttrVal(attrId): string {
        let a = this.itemattrs.find(c => c.attributeId == attrId);

        if (a) {
            return a.attrubuteValue;
        }

        return "";
    }

    getItemAttrUrl(attrId): string {
        let itemAttr = this.itemattrs.find(c => c.attributeId == attrId);

        if (itemAttr && itemAttr.attributeFilePath) {
            return this.auth.apiUrl + itemAttr.attributeFilePath.substr(1);
        }

        return "";
    }

    printPage() {
        // this.log.Log("Print of printing page", "Print of printing page for cat: " + this.category.title + " with rahcode: " + this.rahCode);
    }

    getAttrZoje(): IAttr[] {
        return this.attrs.filter((attr, index) => (index % 2) == 0);
    }

    getAttrFard(): IAttr[] {
        return this.attrs.filter((attr, index) => (index % 2) != 0);
    }

    logout() {
        localStorage.removeItem(this.ItemDataKEY);

        this.router.navigate(['/']);
    }

}
