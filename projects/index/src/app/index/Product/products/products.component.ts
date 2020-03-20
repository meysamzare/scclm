import { Component, OnInit } from '@angular/core';
import { IProductCategory } from 'src/app/Dashboard/Products/ProductCategory/product-category';
import { IProduct } from 'src/app/Dashboard/Products/Product/product';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

    txtSearch = "";

    productCategories: IProductCategory[] = [];

    isLoading = false;
    
    products: IProduct[] = [];
    totalCount = 0;
    sort = "new";
    page = 1;
    pageSize = 12;

    TYPE = 0;

    productTitle = "کتب و جزوات کمک آموزشی";
    url = "products";

    constructor(
        public auth: AuthService,
        private message: MessageService,
        private router: Router,
        private activeRoute: ActivatedRoute,
    ) { 
        this.activeRoute.data.subscribe(data => {
            this.TYPE = data["type"];
            

            if (this.TYPE == 1) {
                this.productTitle = "آموزش های مجازی آفلاین";
                this.url = "virtual-teaching";
            }

        });
    }

    ngOnInit() { 
        this.refreshProducts();
    }

    getProductWriterString(type, writer) {
        if (type == 0 || type == 1) {
            return `نویسنده: ${writer}`;
        }

        if (type == 2 || type == 3) {
            return `مدرس: ${writer}`;
        }
    }
    
    getProductTypeString(type, value) {
        if (type == 0 || type == 1) {
            return `${value} صفحه`;
        }

        if (type == 2 || type == 3) {
            return `${value} دقیقه`;
        }
    }

    setSort(sort) {
        this.sort = sort;

        this.page = 1;

        this.refreshProducts();
    }

    
    setPage(event) {
        this.page = event.page;

        $('html,body').animate({ scrollTop: 0 }, 'slow');

        this.refreshProducts();
    }

    refreshProducts() {
        this.isLoading = true;

        this.auth.post("/api/Product/getIndex", {
            page: this.page,
            sort: this.sort,
            searchText: this.txtSearch,
            totalType: this.TYPE
        }).subscribe(data => {
            if (data.success) {
                this.products = data.data.products;

                this.totalCount = data.data.totalCount;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        }, () => {
            this.isLoading = false;
        });
    }

}
