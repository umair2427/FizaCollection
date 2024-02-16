import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent  implements OnInit {
  resetPasswordForm!: FormGroup;
  isLoading$!: Observable<boolean>;
  message!: string;
  color!: string;
  token!: string;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    public authService: AuthService,
    private toastController: ToastController,
    private router: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.isLoading$ = this.authService.isLoading$;

    this.router.params.subscribe((params) => {
      this.token = params['token'];
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetPasswordForm.controls; }

  async resetPassword() {
    let newPassword = this.resetPasswordForm.get('newPassword')?.value;
    let obj = {
      newPassword: newPassword
    }
    this.authService.resetPassword(obj, this.token).subscribe(
      response => {
        this.message = response.message || '';
        this.color = 'success';
        this.presentToast('top');
        this.resetPasswordForm.reset();
        this.route.navigate(['home'])
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

}
