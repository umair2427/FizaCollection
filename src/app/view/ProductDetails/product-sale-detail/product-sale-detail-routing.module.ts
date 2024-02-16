import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductSaleDetailPage } from './product-sale-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ProductSaleDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductSaleDetailPageRoutingModule {}
