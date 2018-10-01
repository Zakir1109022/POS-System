import { InvoiceCartItems } from "./invoiceCartItems.model";

export class SalesInvoice{
    $key:string;
    invoiceCartItems:InvoiceCartItems[];
    itemsInCart:number;
    subTotal:number;
    discount:number;
    discountAmount:number;
    total:number;
    cash:number;
    due:number;
    createdOn:string;
}