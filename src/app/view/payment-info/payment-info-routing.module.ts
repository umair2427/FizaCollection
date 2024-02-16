import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentInfoPage } from './payment-info.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentInfoPageRoutingModule {}
