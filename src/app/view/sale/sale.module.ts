import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalePageRoutingModule } from './sale-routing.module';

import { SalePage } from './sale.page';
import { SharedModule } from '../shared.module';
import {MatSelectModule} from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalePageRoutingModule,
    SharedModule,
    MatSelectModule,
    NgSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  declarations: [SalePage]
})
export class SalePageModule {}
