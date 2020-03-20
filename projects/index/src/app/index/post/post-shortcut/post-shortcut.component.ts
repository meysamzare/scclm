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

        if (!id) {
            this.navigateToIndex();
        }

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

    ngOnInit() { }

    navigateToIndex() {
        this.router.navigateByUrl("/");
    }

}
