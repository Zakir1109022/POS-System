import { Component, OnInit } from '@angular/core';
import { SalesInvoiceService } from '../invoices/invoice.service';
import { Chart } from 'chart.js'
import { SalesInvoice } from '../invoices/Invoice.model';
import { Product } from '../products/product.model';
import { ProductService } from '../products/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dailySalesInvoiceList: SalesInvoice[];
  stockOutProductList: Product[];
  chart = [];
  revenueChart = [];
  totalProduct = 0;
  totalStockOutProduct = 0;
  totalSalesInvoice = 0;
  totalPurchasePrice = 0;
  totalSalesPrice = 0;
  totalRevenue = 0;

  constructor(
    private SalesInvliceService: SalesInvoiceService,
    private productService: ProductService
  ) { }

  ngOnInit() {

    this.SalesInvliceService.getInvoices()
      .valueChanges()
      .subscribe(res => {
        var today = new Date();
        let invoiceDate = today.toLocaleDateString();
        let price = res.map(res => res.total);
        let createDate = res.map(res => res.createdOn);

        //calculate totalSalesPrice
        price.forEach(item => {
          this.totalSalesPrice += item;
        });

        //chart.js
        var ctx = document.getElementById("totalPricecanvas");
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: createDate,
            datasets: [
              {
                label: "Sales Price",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "rgba(75,192,192,50)",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: price,// my data here, work when I type an array myself
                spanGaps: false,
              }
            ]
          }
        });

      });


    //clculate purchase price
    this.productService.getProducts()
      .valueChanges()
      .subscribe(res => {
        let purchasePrice = res.map(res => res.initial_stock * res.purchase_price);

        //calculate total purchase price
        purchasePrice.forEach(element => {
          this.totalPurchasePrice += element;
        })
       
        //revenuechart.js
        this.totalRevenue=(this.totalSalesPrice-this.totalPurchasePrice);

        var ctx = document.getElementById("revenueCanvas");
        this.revenueChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Total Purchase Price', 'Total Sales price', 'Revenue'],
            datasets: [
              {
                label: 'Revenue',
                fill: false,
                lineTension: 0.1,
                backgroundColor:["blue",'green','yellow'],
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "rgba(75,192,192,50)",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [this.totalPurchasePrice,this.totalSalesPrice,this.totalRevenue],// my data here, work when I type an array myself
                spanGaps: false,
              }
            ]
          }
        });
      });



    //call method
    this.salesInvoiceCount();
    this.productCount();
    this.dailysalesInvoice();
    this.stockOutProduct();

  }


  salesInvoiceCount() {
    var x = this.SalesInvliceService.getInvoices();
    x.snapshotChanges().subscribe(
      item => {
        item.forEach(element => {
          this.totalSalesInvoice = this.totalSalesInvoice + 1;
        });
      });
  }

  productCount() {
    var x = this.productService.getProducts();
    x.snapshotChanges().subscribe(
      item => {
        item.forEach(element => {
          this.totalProduct = this.totalProduct + 1;
        });
      });

  }

  dailysalesInvoice() {
    var today = new Date();
    let invoiceDate = today.toLocaleDateString();

    var x = this.SalesInvliceService.queryInvoice('createdOn', invoiceDate);
    x.snapshotChanges().subscribe(
      item => {
        this.dailySalesInvoiceList = [];
        item.forEach(element => {
          var y = element.payload.toJSON();
          y["$key"] = element.key;
          this.dailySalesInvoiceList.push(y as SalesInvoice);
        });
      });

  }


  stockOutProduct() {
    var x = this.productService.queryProductNumber('remaining_stock', 0);
    x.snapshotChanges().subscribe(
      item => {
        this.stockOutProductList = [];
        item.forEach(element => {
          var y = element.payload.toJSON();
          y["$key"] = element.key;
          this.stockOutProductList.push(y as Product);

          this.totalStockOutProduct = this.totalStockOutProduct + 1;
        });
      });
  }





}
