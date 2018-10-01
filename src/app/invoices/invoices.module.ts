import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InvoicesRoutingModule } from "./invoices-routing.module";
import { InvoicesComponent } from "./invoices.component";
import { EditInvoiceComponent } from "./edit-invoice/edit-invoice.component";
import { InvoiceListComponent } from "./invoice-list/invoice-list.component";
import { ReactiveFormsModule } from "@angular/forms";
import {NgxPaginationModule} from 'ngx-pagination'
import { KeysPipe } from "../customPipe/keys.pipe";


@NgModule({
    declarations: [
        InvoicesComponent,
        EditInvoiceComponent,
        InvoiceListComponent,
        KeysPipe
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InvoicesRoutingModule,
        NgxPaginationModule

    ]
})
export class InvoicesModule {

}