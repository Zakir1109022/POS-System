import { Component, OnInit, ElementRef } from '@angular/core';
import { ProductService } from '../product.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../product.model';
import { Router } from '@angular/router';
import { InvoiceCartItems } from '../../invoices/invoiceCartItems.model';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {

  productList: Product[];
  RowsPerPage = 5;



  constructor
    (
    private router: Router,
    private prodService: ProductService,
    private tostr: ToastrService
    ) { }

  ngOnInit() {
    this.initProductList();

  }



  initProductList() {
    var x = this.prodService.getProducts();
    x.snapshotChanges().subscribe(
      item => {
        this.productList = [];
        item.forEach(element => {
          var y = element.payload.toJSON();
          y["$key"] = element.key;
          this.productList.push(y as Product);
        });
      });
  }

  onEdit(product: Product) {
    this.router.navigate(['/products/edit/' + product.$key]);
  }

  onDelete(key: string) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this.prodService.deleteProduct(key);
      this.tostr.warning("Deleted Successfully", "Products");
    }
  }



  setProductList() {
    this.initProductList();
  }

  filterItem(value) {
    if (!value) this.setProductList(); //when nothing has typed

    this.productList = Object.assign([], this.productList).filter(
      item => item.product_id.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
        item.product_name.toLowerCase().indexOf(value.toLowerCase()) > -1
    )



  }


  onSelectPageRows(rows: any) {
    this.RowsPerPage = rows;
  }






}
