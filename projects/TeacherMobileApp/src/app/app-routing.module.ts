import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { LoginComponent } from './shared/components/login/login.component';
import { LoginGuard } from './shared/guards/login.guard';


const routes: Routes = [
    {
        path: "login",
        component: LoginComponent,
        canActivate: [LoginGuard]
    },
    { path: "**", pathMatch: "full", component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
