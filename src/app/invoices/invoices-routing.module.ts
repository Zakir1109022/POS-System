import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { InvoicesComponent } from "./invoices.component";
import { EditInvoiceComponent } from "./edit-invoice/edit-invoice.component";
import { InvoiceListComponent } from "./invoice-list/invoice-list.component";


const invoicesRoutes: Routes = [
    {
        path: '', component: InvoicesComponent, children:
            [
             {path:'',component:InvoiceListComponent},
             {path:'new',component:EditInvoiceComponent},
             {path:'edit/:key',component:EditInvoiceComponent}
            ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(invoicesRoutes)],
    exports: [RouterModule]
})
export class InvoicesRoutingModule {

}