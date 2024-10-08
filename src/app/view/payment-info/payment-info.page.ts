import {
  Component,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { City, Country, State } from 'country-state-city';
import { Observable, skipWhile, take } from 'rxjs';
import { CartService } from 'src/app/shared/service/cart/cart.service';
import { Product } from 'src/app/shared/service/cart/Product';
import { OrderService } from 'src/app/shared/service/order/order.service';
import { ProductService } from 'src/app/shared/service/product.service';

interface items {
  id?: number;
  name?: string;
  data?: any;
}

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.page.html',
  styleUrls: ['./payment-info.page.scss'],
})
export class PaymentInfoPage implements OnInit {
  orderForm!: FormGroup;
  currentStep: number = 1;

  countries: any[] = [];
  billing_countries: any[] = [];
  states: any[] = [];
  billing_states: any[] = [];
  cities: any[] = [];
  billing_cities: any[] = [];
  selectedCountry: any;
  billing_selectedCountry: any;
  selectedState: any;
  billing_selectedState: any;
  selectedCity: any;
  billing_selectedCity: any;

  cod: boolean = false;
  card: boolean = false;
  bankTransfer: boolean = false;
  billingFormVisible: boolean = false;
  getProductIds: number[] = [];
  deliveryStatus: items[] = [];
  cartItems: any[] = [];
  totalAmount!: number;

  public message: string = '';
  public color: string = 'success';

  isLoading$!: Observable<boolean>;
  constructor(
    private _fb: FormBuilder,
    public dialog: MatDialog,
    private orderService: OrderService,
    private toastController: ToastController,
    private router: Router,
    private cartService: CartService) { }

  ngOnInit() {
    this.countries = Country.getAllCountries();
    this.billing_countries = Country.getAllCountries();
    this.orderForm = this._fb.group({
      billingForm: this._fb.group({
        firstName: [''],
        lastName: [''],
        number: [''],
        email: [''],
        address: [''],
        country: [null],
        province: [null],
        city: [null],
        zipCode: [''],
      }),
      shippingForm: this._fb.group({
        shipping_firstName: ['', [Validators.required]],
        shipping_lastName: ['', [Validators.required]],
        shipping_number: ['', [Validators.required]],
        shipping_email: ['', [Validators.required, Validators.email]],
        shipping_address: ['', [Validators.required]],
        shipping_country: [null, [Validators.required]],
        shipping_province: [null, [Validators.required]],
        shipping_city: [null, [Validators.required]],
        shipping_zipCode: ['', [Validators.required]],
      }),
      totalAmount: ['', [Validators.required]],
      products: ['', [Validators.required]],
      paymentMethod: ['', [Validators.required]],
      cardInfo: this._fb.group({
        cardName: [''],
        cardNum: [''],
        expiry: [''],
        cvc: ['']
      })
    });
    this.isLoading$ = this.orderService.isLoading$;
    this.cartItems = JSON.parse(localStorage.getItem('myCart')!);
    this.totalAmount = JSON.parse(localStorage.getItem('totalAmount')!);
  }

  get f() {
    return (this.orderForm.get('shippingForm') as FormGroup)?.controls;
  }
  get o() {
    return this.orderForm.controls;
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onCountryChange(): void {
    const selectedCountryIsoCode = this.orderForm.get('shippingForm.shipping_country')?.value;

    if (selectedCountryIsoCode !== null) {
      this.states = State.getStatesOfCountry(selectedCountryIsoCode);
      this.selectedCountry = this.countries.find(
        (country) => country.isoCode === selectedCountryIsoCode
      );
    }
    this.cities = this.selectedState = this.selectedCity;
  }

  onCountryBillingChange(): void {
    const selectedCountryIsoCode = this.orderForm.get('billingForm.country')?.value;

    if (selectedCountryIsoCode !== null) {
      this.billing_states = State.getStatesOfCountry(selectedCountryIsoCode);
      this.billing_selectedCountry = this.billing_countries.find(
        (country) => country.isoCode === selectedCountryIsoCode
      );
    }
    this.billing_cities = this.billing_selectedState = this.billing_selectedCity;
  }

  onStateChange(): void {
    const selectedStateIsoCode = this.orderForm.get('shippingForm.shipping_province')?.value;
    const selectedCountryIsoCode = this.orderForm.get('shippingForm.shipping_country')?.value;

    if (selectedStateIsoCode && selectedCountryIsoCode) {
      this.cities = City.getCitiesOfState(
        selectedCountryIsoCode,
        selectedStateIsoCode
      );
      this.selectedState = this.states.find(
        (state: any) => state.isoCode === selectedStateIsoCode
      );
    }
    this.selectedCity = null;
  }

  onBillingStateChange(): void {
    const selectedStateIsoCode = this.orderForm.get('billingForm.province')?.value;
    const selectedCountryIsoCode = this.orderForm.get('billingForm.country')?.value;

    if (selectedStateIsoCode && selectedCountryIsoCode) {
      this.billing_cities = City.getCitiesOfState(
        selectedCountryIsoCode,
        selectedStateIsoCode
      );
      this.billing_selectedState = this.billing_states.find(
        (state: any) => state.isoCode === selectedStateIsoCode
      );
    }
    this.billing_selectedCity = null;
  }

  onCityChange(): void {
    const cityValue = this.orderForm.get('shippingForm.shipping_city')?.value;
    if (typeof cityValue === 'string') {
      this.selectedCity = cityValue;
    } else {
      this.selectedCity = null;
    }
  }

  onBillingCityChange(): void {
    const cityValue = this.orderForm.get('billingForm.city')?.value;
    if (typeof cityValue === 'string') {
      this.billing_selectedCity = cityValue;
    } else {
      this.billing_selectedCity = null;
    }
  }

  onPaymentChange(event: Event) {
    const selectedPaymentMethod = (event.target as HTMLInputElement).value;

    this.cod = false;
    this.card = false;
    this.bankTransfer = false;
    this.billingFormVisible = false;

    if (selectedPaymentMethod === 'COD') {
      this.cod = true;
    } else if (selectedPaymentMethod === 'Bank Transfer') {
      this.bankTransfer = true;
    } else if (selectedPaymentMethod === '3') {
      this.card = true;
    }
  }

  changeEvent(event: Event) {
    this.billingFormVisible = !(event.target as HTMLInputElement).checked;
  }

  submitForm(): void {
    const shippingFormValue = this.orderForm.get('shippingForm')?.value;

    if (!this.orderForm.get('billingForm')?.value.firstName) {
      this.orderForm.get('billingForm')?.patchValue({
        firstName: shippingFormValue.shipping_firstName,
        lastName: shippingFormValue.shipping_lastName,
        email: shippingFormValue.shipping_email,
        address: shippingFormValue.shipping_address,
        number: shippingFormValue.shipping_number,
        country: shippingFormValue.shipping_country,
        province: shippingFormValue.shipping_province,
        city: shippingFormValue.shipping_city,
        zipCode: shippingFormValue.shipping_zipCode
      });
    }
    const cartItemIds = this.cartItems.map((item: any) => item._id);
    const cartDetails = this.cartItems.map((item: any) => {
      return {
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        productName: item.productName,
        productMainImage: item.productMainImage
      };
    });
    this.orderForm.get('paymentMethod')?.value;
    const orderForm = this.orderForm.value
    const payload = {
      email: orderForm.billingForm.email,
      firstName: orderForm.billingForm.firstName,
      lastName: orderForm.billingForm.lastName,
      country: orderForm.billingForm.country,
      city: orderForm.billingForm.city,
      province: orderForm.billingForm.province,
      number: orderForm.billingForm.number,
      address: orderForm.billingForm.address,
      zipCode: orderForm.billingForm.zipCode,
      shipping_firstName: orderForm.shippingForm.shipping_firstName,
      shipping_lastName: orderForm.shippingForm.shipping_lastName,
      shipping_email: orderForm.shippingForm.shipping_email,
      shipping_address: orderForm.shippingForm.shipping_address,
      shipping_number: orderForm.shippingForm.shipping_number,
      shipping_country: orderForm.shippingForm.shipping_country,
      shipping_province: orderForm.shippingForm.shipping_province,
      shipping_city: orderForm.shippingForm.shipping_city,
      shipping_zipCode: orderForm.shippingForm.shipping_zipCode,
      totalAmount: this.totalAmount,
      products: cartItemIds,
      paymentMethod: orderForm.paymentMethod,
      cartDetails: cartDetails
    }
    this.orderService.addOrder(payload).pipe(skipWhile(val => !val), take(1)).subscribe(
      response => {
        this.message = response.message || '';
        this.color = 'success';
        this.presentToast('top');
        this.orderForm.reset();
        this.cartService.clearCart();
        this.router.navigate(['home'])
      },
      error => {
        console.error('Error:', error);
        this.message = error;
        this.color = 'danger';
        this.presentToast('top');
      }
    )
  }

  async presentToast(position: 'top') {
    const toast = await this.toastController.create({
      message: this.message,
      duration: 1500,
      position: position,
      color: this.color,
      cssClass: ['text-center'],
    });
    await toast.present();
  }
}
