import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductSaleDetailPageRoutingModule } from './product-sale-detail-routing.module';

import { ProductSaleDetailPage } from './product-sale-detail.page';
import { SharedModule } from '../../shared.module';
import {MatSelectModule} from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductSaleDetailPageRoutingModule,
    SharedModule,
    MatSelectModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ProductSaleDetailPage]
})
export class ProductSaleDetailPageModule {}
