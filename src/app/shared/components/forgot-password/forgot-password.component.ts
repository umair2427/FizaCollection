import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  isLoading$!: Observable<boolean>;
  message!: string;
  color!: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthService,
    private toastController: ToastController,) { }

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.isLoading$ = this.authService.isLoading$;
  }

  // convenience getter for easy access to form fields
  get f() { return this.forgotPasswordForm.controls; }

  async resetPassword() {
    let email = this.forgotPasswordForm.get('email')?.value;
    let obj = {
      email: email
    }
    this.authService.forgotPassword(obj).subscribe(
      response => {
        this.message = response.message || '';
        this.color = 'success';
        this.presentToast('top');
        this.forgotPasswordForm.reset();
      }, error => {
        console.error('Error placing order:', error);
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
      cssClass: 'text-center'
    });

    await toast.present();
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

}
