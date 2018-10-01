import { Injectable } from "@angular/core";
import { FirebaseDatabase } from "@firebase/database-types";
import { SalesInvoice } from "./Invoice.model";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { ProductService } from "../products/product.service";
import { InvoiceCartItems } from "./invoiceCartItems.model";


@Injectable()
export class SalesInvoiceService {

    invoiceList: AngularFireList<any>;

    constructor(private db: AngularFireDatabase,private productService:ProductService) { }

    getInvoices() {
        this.invoiceList = this.db.list('invoices');
        return this.invoiceList;
    }

    addInvoice(salesInvoice: SalesInvoice,invoiceCartItemList:InvoiceCartItems[]) {
        this.invoiceList.push({
            invoiceCartItems: salesInvoice.invoiceCartItems,
            itemsInCart: salesInvoice.itemsInCart,
            subTotal: salesInvoice.subTotal,
            discount: salesInvoice.discount,
            discountAmount:salesInvoice.discountAmount,
            total: salesInvoice.total,
            cash: salesInvoice.cash,
            due: salesInvoice.due,
            createdOn: salesInvoice.createdOn
        });

        this.productService.updateProductStock(invoiceCartItemList);
    }

    updateInvoice(key:string,salesInvoice: SalesInvoice,invoiceCartItemList:InvoiceCartItems[]){
        this.invoiceList.update(key,{
            invoiceCartItems: salesInvoice.invoiceCartItems,
            itemsInCart: salesInvoice.itemsInCart,
            subTotal: salesInvoice.subTotal,
            discount: salesInvoice.discount,
            discountAmount:salesInvoice.discountAmount,
            total: salesInvoice.total,
            cash: salesInvoice.cash,
            due: salesInvoice.due,
            createdOn: salesInvoice.createdOn
        });

        //  this.productService.updateUpdatedProductStock(invoiceCartItemList);
    }


    deleteInvoice($key: string){
        this.invoiceList.remove($key);
    }


    queryInvoice(columnName: string, value: string) {
        return this.db.list('invoices', ref => ref.orderByChild(columnName).equalTo(value));
    }

}