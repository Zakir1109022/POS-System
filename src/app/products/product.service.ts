import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Product } from "./product.model";
import { InvoiceCartItems } from "../invoices/invoiceCartItems.model";
import { FirebaseDatabase } from "@firebase/database-types";
import { element } from "protractor";


@Injectable()
export class ProductService {



    productList: AngularFireList<any>;

    selectedProduct: Product = new Product();


    constructor(private db: AngularFireDatabase) { }

    getProducts() {
        this.productList = this.db.list('products');
        return this.productList;
    }



    addProduct(product: Product) {
        this.productList.push({
            product_id: product.product_id,
            product_name: product.product_name,
            purchase_price: product.purchase_price,
            price: product.price,
            expire_date: product.expire_date,
            initial_stock: product.initial_stock,
            remaining_stock: product.remaining_stock,
            vat: product.vat,
            unit_measure: product.unit_measure,
            barcode: product.barcode
        });
    }

    updateProduct(product: Product) {
        this.productList.update(product.$key, {
            product_id: product.product_id,
            product_name: product.product_name,
            purchase_price: product.purchase_price,
            price: product.price,
            expire_date: product.expire_date,
            initial_stock: product.initial_stock,
            remaining_stock: product.remaining_stock,
            vat: product.vat,
            unit_measure: product.unit_measure,
            barcode: product.barcode
        });
    }


    updateProductStock(invoiceCartItemList: InvoiceCartItems[]) {
        for (var i = 0; i < invoiceCartItemList.length; i++) {
            let key = invoiceCartItemList[i].productId;
            let Quantity = +invoiceCartItemList[i].quantity;

            var data = this.db.list('products', ref => ref.orderByKey().equalTo(key));
            data.snapshotChanges().subscribe(
                item => {
                    item.forEach(
                        element => {
                            var y = element.payload.toJSON();
                           let remaining_stockDb=+y['remaining_stock'];
                           let remaining_stock=+(remaining_stockDb-Quantity);

                            //update remaining stock
                            this.db.list('products/' + key).
                                set('remaining_stock', remaining_stock);

                                remaining_stockDb=0;
                                remaining_stock=0;
                                Quantity=0;
                        }
                    )
                }
            );



        }


    }


    updateUpdatedProductStock(invoiceCartItemList: InvoiceCartItems[]) {
        for (var i = 0; i < invoiceCartItemList.length; i++) {
            let key = invoiceCartItemList[i].productId;
            let Quantity = +invoiceCartItemList[i].quantity;

            var data = this.db.list('products', ref => ref.orderByKey().equalTo(key));
            data.snapshotChanges().subscribe(
                item => {
                    item.forEach(
                        element => {
                            var y = element.payload.toJSON();
                           let remaining_stockDb=+y['remaining_stock'];
                           let remaining_stock=+(remaining_stockDb-Quantity);

                            //update remaining stock
                            this.db.list('products/' + key).
                                set('remaining_stock', remaining_stock);

                                remaining_stockDb=0;
                                remaining_stock=0;
                                Quantity=0;
                        }
                    )
                }
            );



        }
    }



    deleteProduct($key: string) {
        this.productList.remove($key);
    }


    queryProduct(columnName: string, value: string) {
        return this.db.list('products', ref => ref.orderByChild(columnName).equalTo(value));
    }

    queryProductNumber(columnName: string, value: Number) {
        return this.db.list('products', ref => ref.orderByChild(columnName).equalTo(value.valueOf()));
    }

  
}