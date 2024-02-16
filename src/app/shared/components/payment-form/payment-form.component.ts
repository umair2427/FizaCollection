import { Component, ElementRef, OnInit, VERSION, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Country, State, City } from 'country-state-city';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
})
export class PaymentFormComponent  implements OnInit {
  @ViewChild('country')
  country!: ElementRef;
  @ViewChild('city') city!: ElementRef;
  @ViewChild('state') state!: ElementRef;
  name = 'Angular ' + VERSION.major;
  countries = Country.getAllCountries();
  states: any;
  cities: any;

  selectedCountry: any;
  selectedState: any;
  selectedCity: any;

  constructor(private _formBuilder: FormBuilder) { }

  thirdFormGroup = this._formBuilder.group({
    email: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    country: ['', Validators.required],
    state: ['', Validators.required],
    city: ['', Validators.required],
    zipCode: ['', Validators.required],
    phoneNumber: ['', Validators.required],
  });

  ngOnInit() {}

  onCountryChange(): void {
    const selectedCountryIsoCode = this.thirdFormGroup.get('country')?.value;

    if (selectedCountryIsoCode !== null) {
      this.states = State.getStatesOfCountry(selectedCountryIsoCode);
      this.selectedCountry = this.countries.find(
        (country) => country.isoCode === selectedCountryIsoCode
      );
    }
    this.cities = this.selectedState = this.selectedCity = null;
  }

  onStateChange(): void {
    const selectedStateIsoCode = this.thirdFormGroup.get('state')?.value;
    const selectedCountryIsoCode = this.thirdFormGroup.get('country')?.value;

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

  onCityChange(): void {
    const cityValue = this.thirdFormGroup.get('city')?.value;
    if (typeof cityValue === 'string') {
      this.selectedCity = cityValue;
    } else {
      this.selectedCity = null;
    }
  }

}
