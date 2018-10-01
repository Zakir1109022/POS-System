import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProductsComponent } from "./products.component";
import { EditProductComponent } from "./edit-product/edit-product.component";
import { ProductListComponent } from "./product-list/product-list.component";



const productRoute: Routes = [
    {
        path: '', component: ProductsComponent, children: [
            { path: '', component: ProductListComponent },
            { path: 'new', component: EditProductComponent },
            { path: 'edit/:key', component: EditProductComponent }
        ]
    }

];



@NgModule({
    imports: [
        RouterModule.forChild(productRoute)
    ],
    exports: [
        RouterModule
    ]

})
export class ProductsRoutingModule {

}