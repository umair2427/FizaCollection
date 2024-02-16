import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewCartPageRoutingModule } from './view-cart-routing.module';

import { ViewCartPage } from './view-cart.page';
import { SharedModule } from '../shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewCartPageRoutingModule,
    SharedModule
  ],
  declarations: [ViewCartPage]
})
export class ViewCartPageModule {}
