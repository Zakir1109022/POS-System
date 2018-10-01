import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from '../product.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../product.model';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {


  key: string;
  editMode = false;
  actionName="New";

  productList: Product[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public prodService: ProductService,
    private tostr: ToastrService
  ) { }

  ngOnInit() {
this.prodService.getProducts();
    this.route.params
      .subscribe(
        (params: Params) => {
          //getting route parameter value
          this.key = params['key'];
          //If parameter value null
          this.editMode = params['key'] != null;

          if (this.editMode) {
            this.actionName="Edit"
            
            const data = this.prodService.getProducts();
            data.snapshotChanges().subscribe(
              (iteam) => {
                this.productList = [];
                iteam.forEach(element => {
                  const list = element.payload.toJSON();
                  list["$key"] = element.key;
                  if (list["$key"] === this.key) {
                    this.productList.push(list as Product)
                    this.prodService.selectedProduct = this.productList[0];
                  }
                });
              });
          }


        }
      )
  }



  onSubmit(productForm: NgForm) {
    if (productForm.value.$key == null) {
      console.log(productForm.value);
      this.prodService.addProduct(productForm.value);
      this.tostr.success('Submitted Succcessfully', 'Products');
      productForm.reset();
    }
    else {
      this.prodService.updateProduct(productForm.value);
      this.tostr.success('Update Succcessfully', 'Products');
    }

   
  
  }




}
