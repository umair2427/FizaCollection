import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalePageRoutingModule } from './sale-routing.module';

import { SalePage } from './sale.page';
import { SharedModule } from '../shared.module';
import {MatSelectModule} from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalePageRoutingModule,
    SharedModule,
    MatSelectModule,
    NgSelectModule
  ],
  declarations: [SalePage]
})
export class SalePageModule {}
