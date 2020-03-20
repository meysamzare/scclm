import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginCanActiveGuard } from './login/login-can-active.guard';


const routes: Routes = [
    {
        path: "login",
        component: LoginComponent,
        canActivate: [LoginCanActiveGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        useHash: true
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
