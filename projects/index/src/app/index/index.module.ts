import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexRoutingModule } from './index-routing.module';
import { PostComponent } from './post/post.component';
import { PostsComponent } from './posts/posts.component';
import { BootstrapModule } from 'src/app/shared/bootstrap/bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';
import { PostCommentComponent } from './post/post-comment/post-comment.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ViewGalleryComponent } from './gallery/view-gallery/view-gallery.component';
import { ViewImageModalComponent } from './gallery/view-gallery/view-image-modal/view-image-modal.component';
import { PostShortcutComponent } from './post/post-shortcut/post-shortcut.component';
import { CopyClipboardDirective } from '../shared/copy-clipboard.directive';
import { ProductsComponent } from './Product/products/products.component';
import { ProductComponent } from './Product/product/product.component';
import { RouterModule } from '@angular/router';
import { ViewVirtualTeachingComponent } from './Product/view-virtual-teaching/view-virtual-teaching.component';

@NgModule({
    declarations: [
        PostComponent,
        PostsComponent,
        PostCommentComponent,
        GalleryComponent,
        ViewGalleryComponent,
        ViewImageModalComponent,
        PostShortcutComponent,
        CopyClipboardDirective,
        ProductsComponent,
        ProductComponent,
        ViewVirtualTeachingComponent,
    ],
    imports: [
        CommonModule,
        IndexRoutingModule,
        BootstrapModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule
    ],
    entryComponents: [ViewImageModalComponent]
})
export class IndexModule { }
