import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainIndexComponent } from './main-index/main-index.component';
import { IndexComponent } from './index.component';
import { PostComponent } from './post/post.component';
import { PostResolverService } from './post/post-resolver.service';
import { PostsComponent } from './posts/posts.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ViewGalleryComponent } from './gallery/view-gallery/view-gallery.component';
import { ViewGalleryResolveService } from './gallery/view-gallery/view-gallery-resolve.service';
import { PostShortcutComponent } from './post/post-shortcut/post-shortcut.component';
import { ProductsComponent } from './Product/products/products.component';
import { ProductComponent } from './Product/product/product.component';
import { LoadIdataResolverService } from 'src/app/shared/Auth/load-idata-resolver.service';
import { ViewVirtualTeachingComponent } from './Product/view-virtual-teaching/view-virtual-teaching.component';
import { OnlineExamsComponent } from './online-exams/online-exams.component';

const routes: Routes = [
    {
        path: "",
        component: MainIndexComponent,
        children: [
            {
                path: "",
                pathMatch: "full",
                component: IndexComponent
            },
            {
                path: "post",
                children: [
                    {
                        path: ":id/:title?",
                        component: PostComponent,
                        resolve: {
                            post: PostResolverService
                        }
                    },
                    {
                        path: ":id",
                        component: PostShortcutComponent,
                        data: {
                            type: 0
                        }
                    }
                ]

            },
            {
                path: "online-exam",
                children: [
                    {
                        path: "",
                        pathMatch: "full",
                        component: OnlineExamsComponent
                    }
                ]
            },
            {
                path: "posts",
                children: [
                    {
                        path: "",
                        component: PostsComponent,
                        pathMatch: "full",
                    }
                ]
            },
            {
                path: "gallery",
                children: [
                    {
                        path: "",
                        pathMatch: "full",
                        component: GalleryComponent
                    },
                    {
                        path: "view/:id",
                        component: ViewGalleryComponent,
                        resolve: {
                            pics: ViewGalleryResolveService
                        }
                    }
                ]
            },
            {
                path: "products",
                children: [
                    {
                        path: "",
                        pathMatch: "full",
                        component: ProductsComponent,
                        data: {
                            type: 0
                        }
                    },
                    {
                        path: ":id/:title",
                        component: ProductComponent
                    },
                    {
                        path: ":id",
                        component: PostShortcutComponent,
                        data: {
                            type: 2
                        }
                    }
                ]
            },
            {
                path: "virtual-teaching",
                children: [
                    {
                        path: "",
                        pathMatch: "full",
                        component: ProductsComponent,
                        data: {
                            type: 1
                        }
                    },
                    {
                        path: ":id/:title",
                        component: ViewVirtualTeachingComponent
                    },
                    {
                        path: ":id",
                        component: PostShortcutComponent,
                        data: {
                            type: 1
                        }
                    }
                ]
            }
        ],
        resolve: {
            idata: LoadIdataResolverService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IndexRoutingModule { }
