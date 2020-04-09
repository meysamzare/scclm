import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/Auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-post-shortcut',
    templateUrl: './post-shortcut.component.html',
    styleUrls: ['./post-shortcut.component.scss']
})
export class PostShortcutComponent implements OnInit {

    constructor(
        private auth: AuthService,
        private router: Router,
        private activeRoute: ActivatedRoute
    ) {
        var id = this.activeRoute.snapshot.params["id"];

        let TYPE = this.activeRoute.snapshot.data["type"];

        if (!id) {
            this.navigateToIndex();
        }

        // Post
        if (TYPE == 0) {
            this.auth.post("/api/Post/getPostTitle", id).subscribe(data => {
                if (data.success) {
                    this.router.navigateByUrl(`/post/${id}/${data.data}`);
                } else {
                    this.navigateToIndex();
                }
            }, er => {
                this.auth.handlerError(er);
            });
        }
        
        // Virtual Teaching
        if (TYPE == 1) {
            this.auth.post("/api/Product/getProductTitle", id).subscribe(data => {
                if (data.success) {
                    this.router.navigateByUrl(`/virtual-teaching/${id}/${data.data}`);
                } else {
                    this.navigateToIndex();
                }
            }, er => {
                this.auth.handlerError(er);
            })
        }
        
        // Product (Books)
        if (TYPE == 2) {
            this.auth.post("/api/Product/getProductTitle", id).subscribe(data => {
                if (data.success) {
                    this.router.navigateByUrl(`/products/${id}/${data.data}`);
                } else {
                    this.navigateToIndex();
                }
            }, er => {
                this.auth.handlerError(er);
            })
        }
    }

    ngOnInit() { }

    navigateToIndex() {
        this.router.navigateByUrl("/");
    }

}
