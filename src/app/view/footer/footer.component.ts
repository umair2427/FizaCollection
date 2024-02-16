import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { CustomerService } from 'src/app/shared/service/customer/customer.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  beFriend!: FormGroup;
  public message: string = '';
  public color: string = 'success';
  constructor(private customerService: CustomerService, private toastController: ToastController) { }

  ngOnInit() {
    this.beFriend = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

   // convenience getter for easy access to form fields
   get f() { return this.beFriend.controls; }

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

  onSubmit(){
    if (this.beFriend.invalid) {
      // Mark all form controls as touched to display the validation errors
      Object.values(this.beFriend.controls).forEach(control => {
        control.markAsTouched();
      });
      this.message = 'Input fields are invalid';
      this.color = 'danger';
      this.presentToast('top');
    } else {
      const beFriend = this.beFriend.value;
      let obj = {
        email: beFriend.email
      };
      this.customerService.beFriend(obj).subscribe(
        response => {
          this.message = response.message;
          this.presentToast('top');
          this.beFriend.reset();
        },
        error => {
          this.message = error.error;
          this.presentToast('top');
        }
      )
    }
  }
}
