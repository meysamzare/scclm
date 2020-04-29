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

    selectedCats: IProductCategory[] = [];

    searchCats = "";

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


        this.auth.post("/api/ProductCategory/getAll").subscribe(data => {
            if (data.success) {
                this.productCategories = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }

    toggleCatFilter(category: IProductCategory, checked: boolean) {
        let cat = this.selectedCats.find(c => c.id == category.id);

        if (checked) {
            if (!cat) {
                this.selectedCats.push(category);
            }
        } else {
            if (cat) {
                this.selectedCats.splice(this.selectedCats.indexOf(cat), 1);
            }
        }

        this.refreshProducts();
    }

    isCatSelected(id: number): boolean {
        let cat = this.selectedCats.find(c => c.id == id);

        return cat ? true : false;
    }

    getFiltredCats() {
        if (this.searchCats) {
            return this.productCategories.filter(c => c.title.includes(this.searchCats));
        }

        return this.productCategories;
    }

    getProductWriterPic(product) {
        return this.auth.getFileUrl(product.writerPic);
    }

    getColor() {
        if (this.TYPE == 1) {
            return "#4c97e5";
        }

        if (this.TYPE == 2) {
            return "#08679482";
        }
    }

    getGradentOfTop() {
        return 'linear-gradient(to bottom, ' + this.getColor() + ', #f4f4f4)';
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
            totalType: this.TYPE,
            cats: this.selectedCats.map(c => c.id)
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
