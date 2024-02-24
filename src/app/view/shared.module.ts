import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductViewComponent } from '../shared/components/product-view/product-view.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { SideBarComponent } from '../shared/components/side-bar/side-bar.component';
import { PaymentFormComponent } from '../shared/components/payment-form/payment-form.component';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_RADIO_DEFAULT_OPTIONS,
  MatRadioModule,
} from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AuthComponent } from '../shared/components/auth/auth.component';
import { RegisterComponent } from '../shared/components/register/register.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProfileComponent } from '../shared/components/profile/profile.component';
import { ForgotPasswordComponent } from '../shared/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../shared/components/reset-password/reset-password.component';
import { OrdersHistoryComponent } from '../shared/components/orders-history/orders-history.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ProductViewComponent,
    SideBarComponent,
    PaymentFormComponent,
    AuthComponent,
    RegisterComponent,
    ProfileComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    OrdersHistoryComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ProductViewComponent,
    PaymentFormComponent,
    AuthComponent,
    RegisterComponent,
    ProfileComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    OrdersHistoryComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,
    CarouselModule,
    NgSelectModule
  ],
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
  ],
})
export class SharedModule {}
