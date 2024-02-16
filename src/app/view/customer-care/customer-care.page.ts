import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { CustomerService } from 'src/app/shared/service/customer/customer.service';


@Component({
  selector: 'app-customer-care',
  templateUrl: './customer-care.page.html',
  styleUrls: ['./customer-care.page.scss'],
})
export class CustomerCarePage implements OnInit {
  customerForm!: FormGroup;
  public message: string = '';
  public color: string = 'success';
  constructor(private fb: FormBuilder,
    private toastController: ToastController,
    private customerService: CustomerService) {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]]
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.customerForm.controls; }

  ngOnInit() {
  }

  submitCustomerForm() {
    if (this.customerForm.invalid) {
      // Mark all form controls as touched to display the validation errors
      Object.values(this.customerForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.message = 'Input fields are invalid';
      this.color = 'danger';
      this.presentToast('top');
    } else {
      const customerValues = this.customerForm.value;
      let obj = {
        name: customerValues.name,
        email: customerValues.email,
        subject: customerValues.subject,
        message: customerValues.message
      }
      // this.customerService.addComplain(obj).subscribe(
      //   response => {
      //     console.log(response);
      //   },
      //   error => {
      //     console.log(error);
      //   }
      // )
    }
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
