import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { HomeComponent } from "./core/home/home.component";
import { AuthGuard } from "./auth/auth-guard.service";


const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    {
        path:'dashboard',loadChildren:'./dashboard/dashboard.module#DashboardModule',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard]
       
    },
    { 
        path: 'products', loadChildren: './products/products.module#ProductsModule' ,
        canLoad: [AuthGuard],
        canActivate: [AuthGuard]
    },
    {
        path:'invoices',loadChildren:'./invoices/invoices.module#InvoicesModule',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard]
    }
];


@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]

})
export class AppRoutingModule {

}