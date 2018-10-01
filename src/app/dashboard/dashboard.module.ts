import { NgModule } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { CommonModule } from "@angular/common";
import {NgxPaginationModule} from 'ngx-pagination'

@NgModule({
    declarations:[
        DashboardComponent
    ],
    imports:[
        CommonModule,
        DashboardRoutingModule,
        NgxPaginationModule
    ]
})
export class DashboardModule{}