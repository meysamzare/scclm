import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { IndexComponent } from './index/index.component';
import { TestComponent } from './test/test.component';
import { MainCanActiveGuard } from './main-can-active.guard';


const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        canActivate: [MainCanActiveGuard],
        canActivateChild: [MainCanActiveGuard],
        children: [
            {
                path: "",
                pathMatch: "full",
                component: IndexComponent
            },
            {
                path: "a",
                component: TestComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRoutingModule { }
