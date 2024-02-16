import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerCarePageRoutingModule } from './customer-care-routing.module';

import { CustomerCarePage } from './customer-care.page';
import { SharedModule } from '../shared.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerCarePageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [CustomerCarePage]
})
export class CustomerCarePageModule {}
