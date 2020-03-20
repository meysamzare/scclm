import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { RegisterItemCatComponent } from './register-item/register-item.component';
import { RegisterItemService } from 'src/app/register-item/register-item.service';
import { RegisterItemCategoryService } from 'src/app/register-item/register-item-category.service';
import { CanDeActiveRegisterItem } from 'src/app/register-item/candeactive-registeritem.service';
import { InfoItemComponent } from './login-item/info-item/info-item.component';
import { InfoItemResolverService } from 'src/app/info-item/info-item-resolver.service';
import { LoginItemComponent } from './login-item/login-item.component';
import { LoadIdataResolverService } from 'src/app/shared/Auth/load-idata-resolver.service';
import { UnitsResolverService } from './register-item/units-resolver.service';
import { LoginForRegisterItemComponent } from './register-item/login-for-register-item/login-for-register-item.component';
import { LicenseForRegisterItemComponent } from './register-item/license-for-register-item/license-for-register-item.component';

const routes: Routes = [
	{
        path: "register-item/:id",
        children: [
            {
                path: "",
                component: RegisterItemCatComponent,
                resolve: {
                    units: UnitsResolverService,
                    attrs: RegisterItemService,
                    cat: RegisterItemCategoryService
                },
                canDeactivate: [CanDeActiveRegisterItem]
            },
            {
                path: "login",
                component: LoginForRegisterItemComponent
            },
            {
                path: "license",
                component: LicenseForRegisterItemComponent,
                resolve: {
                    cat: RegisterItemCategoryService
                }
            }
        ],
        resolve: {
            idata: LoadIdataResolverService
        }
	},
	{
		path: "login-item/:catId/:type",
		component: LoginItemComponent
	},
	{
		path: "item-info/:catId/:rahcode/:type",
		component: InfoItemComponent,
		resolve: {
			item: InfoItemResolverService
		}
	},
	{ path: "**", component: NotFoundComponent, pathMatch: "full" }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {
		useHash: true,
		scrollPositionRestoration: "enabled",
		preloadingStrategy: PreloadAllModules,
		initialNavigation: "enabled"
	})],
	exports: [RouterModule]
})
export class AppRoutingModule { }
