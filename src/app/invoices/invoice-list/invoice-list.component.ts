import { Component, OnInit } from '@angular/core';
import { SalesInvoice } from '../Invoice.model';
import { ToastrService } from 'ngx-toastr';
import { SalesInvoiceService } from '../invoice.service';
import { Router} from '@angular/router';



@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {

  salesInvoiceList: SalesInvoice[];
  RowsPerPage=5;

  constructor(
    private router:Router,
    private salesInvoiceService:SalesInvoiceService,
    private tostr: ToastrService
  ) { }

  ngOnInit() {

    //call method
    this.initsalesInvoiceList();

  }

  initsalesInvoiceList(){
    var x = this.salesInvoiceService.getInvoices();
    x.snapshotChanges().subscribe(
      item => {
      this.salesInvoiceList = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.salesInvoiceList.push(y as SalesInvoice);
      });
    });
  }


  onEdit(invoice:SalesInvoice){
    this.router.navigate(['/invoices/edit/' + invoice.$key]);
  }

  onDelete(key:string){
    if (confirm('Are you sure to delete this record ?') == true) {
      this.salesInvoiceService.deleteInvoice(key);
      this.tostr.warning("Deleted Successfully", "Invoice");
    }
  }

  onSelectPageRows(rows:any){
    this.RowsPerPage=rows;
   }


   filterItem(value){
    if(!value) this.initsalesInvoiceList(); //when nothing has typed

    this.salesInvoiceList = Object.assign([], this.salesInvoiceList).filter(
       item => item.$key.toLowerCase().indexOf(value.toLowerCase()) > -1 
    )
 }
 


}
