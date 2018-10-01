import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormGroup, FormControlName, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductService } from '../../products/product.service';
import { Product } from '../../products/product.model';
import { SalesInvoiceService } from '../invoice.service';
import { ToastrService } from 'ngx-toastr';
import { SalesInvoice } from '../Invoice.model';
import { InvoiceCartItems } from '../invoiceCartItems.model';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.css']
})
export class EditInvoiceComponent implements OnInit {

  //variables
  key: string;
  editMode = false;

  SalesInvoiceForm: FormGroup;
  productPriceValue = 0;
  productBarcodeValue = '';
  productNameValue = '';
  totalPriceValue = 0;

  invoiceId = '';
  subTotal = 0;
  cartItems = 0;
  totalPrice = 0;
  finalPrice = 0;
  dueAmount = 0;
  discountPercentage = 0;
  discountAmount = 0;
  cash = 0;


  productId = '';
  productName = '';

  //init quantityPrice array
  productList = [];
  invoiceList: SalesInvoice[];
  invoiceCartitemList: InvoiceCartItems[];




  //local references
  @ViewChild('barcode') barCode: ElementRef;
  @ViewChild('price') price: ElementRef;
  @ViewChild('quantity') quantity: ElementRef;
  @ViewChild('itemTotalPrice') itemTotalPrice: ElementRef;
  @ViewChild('pIdValue') pIdValue: ElementRef;
  @ViewChild('pName') pName: ElementRef;


  //local reference
  @ViewChild('discountPercent') discountPercent: ElementRef;
  @ViewChild('discountAmountValue') discountAmountValue: ElementRef;
  @ViewChild('subTotalValue') subTotalValue: ElementRef;
  @ViewChild('finalPriceValue') finalPriceValue: ElementRef;
  @ViewChild('cashValue') cashValue: ElementRef;
  @ViewChild('itemIncartValue') itemIncartValue: ElementRef;





  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prodService: ProductService,
    private salesInvoiceService: SalesInvoiceService,
    private tostr: ToastrService
  ) { }

  ngOnInit() {
    //get key from url
    this.route.params.subscribe(
      (params: Params) => {
        this.key = params['key'];
        this.editMode = params['key'] != null;

        //call firebase
        const data = this.salesInvoiceService.getInvoices();

        //init form for reactive form
        this.initForm();
      }
    )


  }



  onSubmit() {
    var today = new Date();
    let invoiceDate = today.toLocaleDateString();

    //update form value that are not update automatically
    this.SalesInvoiceForm.value.itemsInCart = this.cartItems;
    this.SalesInvoiceForm.value.subTotal = this.subTotal;
    this.SalesInvoiceForm.value.total = this.finalPrice;
    this.SalesInvoiceForm.value.due = this.dueAmount;
    this.SalesInvoiceForm.value.cash = +this.cashValue.nativeElement.value;
    this.SalesInvoiceForm.value.discount = +this.discountPercent.nativeElement.value;
    this.SalesInvoiceForm.value.discountAmount = +this.discountAmountValue.nativeElement.value;
    this.SalesInvoiceForm.value.createdOn = invoiceDate;


    this.invoiceCartitemList = [];
    for (let cartItem of (<FormArray>this.SalesInvoiceForm.get('invoiceCartItems')).controls) {
      this.invoiceCartitemList.push({
        productId: cartItem.get('productId').value,
        price: cartItem.get('price').value,
        productName: cartItem.get('productName').value,
        quantity: cartItem.get('quantity').value,
        totalPrice: cartItem.get('totalPrice').value
      });
    }


    if (this.editMode) {
      //update data
      this.salesInvoiceService.updateInvoice(this.key, this.SalesInvoiceForm.value, this.invoiceCartitemList);
      this.tostr.success('Succcessfully updated', 'Invoice');
      this.router.navigate(['/invoices']);
    }
    else {
      //save data
      this.salesInvoiceService.addInvoice(this.SalesInvoiceForm.value, this.invoiceCartitemList);
      this.tostr.success('Succcessfully added', 'Invoice');
    }

    //reset form
    this.SalesInvoiceForm.reset();

    //set cartItem section initial state
    (<FormArray>this.SalesInvoiceForm.get('invoiceCartItems')).controls = [];

    //reset
    this.invoiceCartitemList.splice(0);
    this.cartItems=0;
    this.subTotal=0;

  }




  onBarcodeUp() {
    let barCode = this.barCode.nativeElement.value;

    if (barCode != null && barCode.length > 5) {
      this.prodService.queryProduct('barcode', barCode).snapshotChanges().subscribe(
        item => {
          item.forEach(
            element => {
              var y = element.payload.toJSON();
              y["$key"] = element.key;
              this.productList.push(y as Product);
              let price=+(this.productList[0].price);
              let vat=+(this.productList[0].vat);
              this.productPriceValue = price+(price*vat)/100;
              this.productBarcodeValue = this.productList[0].$key;
              this.productNameValue = this.productList[0].product_name;

              //after getting value remove the product
              this.productList.pop();
            })
        })
    }

  }



  onQuantityUp() {
    let quantity = (+this.quantity.nativeElement.value);
    this.totalPriceValue = (this.productPriceValue) * quantity;
  }



  onDiscountUp() {
    //set 
    this.discountAmountValue.nativeElement.value = 0;

    //calculate final price
    let subTotal = (+this.subTotalValue.nativeElement.value);
    let discountPercent = (+this.discountPercent.nativeElement.value);
    this.finalPrice = subTotal - (subTotal * discountPercent) / 100;

    //set and claculate due amount
    this.dueAmount = (+this.finalPrice) - (+this.cashValue.nativeElement.value);

  }


  onDiscountAmountUp() {
    //set
    this.discountPercent.nativeElement.value = 0;

    //clculate final price
    this.finalPrice = (+this.subTotalValue.nativeElement.value) - (+this.discountAmountValue.nativeElement.value);

    //set
    this.dueAmount = (+this.finalPrice) - (+this.cashValue.nativeElement.value);
  }

  onCashUp() {
    //calculate due amount
    let FinalPrice = (+this.finalPriceValue.nativeElement.value);
    let CashPrice = (+this.cashValue.nativeElement.value);
    this.dueAmount = FinalPrice - CashPrice;
  }


  onDeleteCartItem(index: number) {

    let totalPrice = +(<FormArray>this.SalesInvoiceForm.get('invoiceCartItems')).at(index).get('totalPrice').value;
    let quantity = +(<FormArray>this.SalesInvoiceForm.get('invoiceCartItems')).at(index).get('quantity').value;

    //calculate cartItem and subtotal
    this.cartItems = this.cartItems - (+quantity);
    this.subTotal = this.subTotal - (+totalPrice);


    //calculate final price
    let discountPercent = (+this.discountPercent.nativeElement.value);
    let discountAmount = (+this.discountAmountValue.nativeElement.value);
    let CashPrice = (+this.cashValue.nativeElement.value);

    //check
    if (discountPercent > 0) {
      this.finalPrice = this.subTotal - (this.subTotal * discountPercent) / 100;
      this.dueAmount = this.finalPrice - CashPrice;
      console.log(this.finalPrice);
    }

    //check
    if (discountAmount > 0) {
      //clculate final price
      this.finalPrice = this.subTotal - discountAmount;
      this.dueAmount = this.finalPrice - CashPrice;
      console.log(this.finalPrice);
    }

    //check
    if (this.cartItems == 0) {
      this.discountAmountValue.nativeElement.value = 0;
      this.discountPercent.nativeElement.value = 0;
      this.finalPrice = 0;
      this.cashValue.nativeElement.value = 0;
      this.dueAmount = 0;
    }

    //remove invoiceCart item of specific index
    (<FormArray>this.SalesInvoiceForm.get('invoiceCartItems')).removeAt(index);


  }


  onCartQuantityUp(element: string, index: number) {

    //get quantity change value and calculate totalPrice
    let price = (+(<FormArray>this.SalesInvoiceForm.get('invoiceCartItems')).at(index).get('price').value);
    let quantity = +element;
    (<FormArray>this.SalesInvoiceForm.get('invoiceCartItems')).at(index).get('totalPrice').setValue(price * quantity);


    let subTotal = 0;
    let cartItems = 0;
    let i = 0;

    for (let control of (<FormArray>this.SalesInvoiceForm.get('invoiceCartItems')).controls) {
      subTotal = subTotal + (+(<FormArray>this.SalesInvoiceForm.get('invoiceCartItems')).at(i).get('totalPrice').value);
      cartItems = cartItems + (+(<FormArray>this.SalesInvoiceForm.get('invoiceCartItems')).at(i).get('quantity').value);
      i++;
    }

    //set subtotal and cart items
    this.subTotal = subTotal;
    this.cartItems = cartItems;


    //calculate final price
    let discountPercent = (+this.discountPercent.nativeElement.value);

    if (discountPercent >=0) {
      this.finalPrice = this.subTotal - (this.subTotal * discountPercent) / 100;
      //set and claculate due amount
      this.dueAmount = (+this.finalPrice) - (+this.cashValue.nativeElement.value);
      //set 
      this.discountAmountValue.nativeElement.value = 0;
    }

    //calculate final price
    let discountAmount = (+this.discountAmountValue.nativeElement.value);

    if (discountAmount >=0) {
      //clculate final price
      this.finalPrice = (+this.subTotalValue.nativeElement.value) - (+this.discountAmountValue.nativeElement.value);
      //set
      this.dueAmount = (+this.finalPrice) - (+this.cashValue.nativeElement.value);
      //set
      this.discountPercent.nativeElement.value = 0;
    }


  }




  onAddItem() {
    //declare variables
    let pIdValue = this.pIdValue.nativeElement.value;
    let prodname = this.pName.nativeElement.value;
    let price = this.price.nativeElement.value;
    let quantity = this.quantity.nativeElement.value;
    let totalPrice = this.itemTotalPrice.nativeElement.value;

    //add form Group dynamically
    (<FormArray>this.SalesInvoiceForm.get('invoiceCartItems')).push(
      new FormGroup({
        'productId': new FormControl(pIdValue, Validators.required),
        'productName': new FormControl(prodname, Validators.required),
        'price': new FormControl(price, Validators.required),
        'quantity': new FormControl(quantity, Validators.required),
        'totalPrice': new FormControl(totalPrice, Validators.required)
      })
    )



    //calculate cartItems and subTotal
    this.cartItems = this.cartItems + (+quantity);
    this.subTotal = this.subTotal + (+totalPrice);

    //set Focus to barcode
    this.barCode.nativeElement.focus();

    //reset 
    this.barCode.nativeElement.value = null;
    this.price.nativeElement.value = 0;
    this.quantity.nativeElement.value = '';
    this.itemTotalPrice.nativeElement.value = 0

  }



  //initiate reactive form
  private initForm() {
    var today = new Date();
    let invoiceDate = today.toLocaleDateString();
    let invoiceCartItems = new FormArray([]);

    //check 
    if (this.editMode) {
      var x = this.salesInvoiceService.getInvoices();
      x.snapshotChanges().subscribe(
        item => {
          this.invoiceList = [];
          this.invoiceCartitemList = [];
          item.forEach(element => {
            var y = element.payload.toJSON();
            y["$key"] = element.key;

            if (y["$key"] === this.key) {
              this.invoiceList.push(y as SalesInvoice);
              //update value
              this.cartItems = this.invoiceList[0].itemsInCart;
              this.subTotal = this.invoiceList[0].subTotal;
              this.discountPercentage = this.invoiceList[0].discount;
              this.discountAmount = this.invoiceList[0].discountAmount;
              this.finalPrice = this.invoiceList[0].total;
              this.cash = this.invoiceList[0].cash;
              this.dueAmount = this.invoiceList[0].due;
              invoiceDate = this.invoiceList[0].createdOn;

              //set value
              this.invoiceCartitemList = this.invoiceList[0].invoiceCartItems;

              // console.log(Object.keys(this.invoiceCartitemList).length);

              for (var i = 0; i < Object.keys(this.invoiceCartitemList).length; i++) {
                let cartItem: InvoiceCartItems;
                cartItem = this.invoiceList[0].invoiceCartItems[i];
                (<FormArray>this.SalesInvoiceForm.get('invoiceCartItems')).push(
                  new FormGroup({
                    'productId': new FormControl(cartItem.productId, Validators.required),
                    'productName': new FormControl(cartItem.productName, Validators.required),
                    'price': new FormControl(cartItem.price, Validators.required),
                    'quantity': new FormControl(cartItem.quantity, Validators.required),
                    'totalPrice': new FormControl(cartItem.totalPrice, Validators.required)
                  })
                )
              }
            }

          });
        });


    }

    //init Reactive Form
    this.SalesInvoiceForm = new FormGroup({
      'invoiceCartItems': invoiceCartItems,
      'itemsInCart': new FormControl(this.cartItems),
      'subTotal': new FormControl(this.subTotal),
      'discount': new FormControl(this.discountPercentage),
      'discountAmount': new FormControl(this.discountAmount),
      'total': new FormControl(this.finalPrice),
      'cash': new FormControl(this.cash, Validators.required),
      'due': new FormControl(this.dueAmount),
      'createdOn': new FormControl(invoiceDate)
    });

  }

}
