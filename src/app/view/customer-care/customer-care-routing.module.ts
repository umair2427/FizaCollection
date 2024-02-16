import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerCarePage } from './customer-care.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerCarePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerCarePageRoutingModule {}
