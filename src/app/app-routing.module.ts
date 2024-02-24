import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './shared/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './shared/components/reset-password/reset-password.component';
import { OrdersHistoryComponent } from './shared/components/orders-history/orders-history.component';
import { CartGuard } from './shared/guards/cart-guard/cart.guard';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./view/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'shop',
    loadChildren: () => import('./view/shop/shop.module').then( m => m.ShopPageModule)
  },
  {
    path: 'sale',
    loadChildren: () => import('./view/sale/sale.module').then( m => m.SalePageModule)
  },
  {
    path: 'customer-care',
    loadChildren: () => import('./view/customer-care/customer-care.module').then( m => m.CustomerCarePageModule)
  },
  {
    path: 'product-detail/:id',
    loadChildren: () => import('./view/ProductDetails/product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
  },
  {
    path: 'product-sale-detail/:id',
    loadChildren: () => import('./view/ProductDetails/product-sale-detail/product-sale-detail.module').then( m => m.ProductSaleDetailPageModule)
  },
  {
    path: 'view-cart',
    loadChildren: () => import('./view/view-cart/view-cart.module').then( m => m.ViewCartPageModule),
    canActivate: [CartGuard]
  },
  {
    path: 'payment-info',
    loadChildren: () => import('./view/payment-info/payment-info.module').then( m => m.PaymentInfoPageModule),
    canActivate: [CartGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent
  },
  {
    path: 'order-history',
    component: OrdersHistoryComponent
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
