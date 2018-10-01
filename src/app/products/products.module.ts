import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProductsRoutingModule } from "./products-routing.module";
import { FormsModule } from "@angular/forms";
import {NgxPaginationModule} from 'ngx-pagination'

import { ProductsComponent } from "./products.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { EditProductComponent } from "./edit-product/edit-product.component";


@NgModule({
    declarations:[
        ProductsComponent,
        ProductListComponent,
        EditProductComponent
    ],
    imports:[
        CommonModule,
        ProductsRoutingModule,
        FormsModule,
        NgxPaginationModule
    ]
})

export class ProductsModule{

}