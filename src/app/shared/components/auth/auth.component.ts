import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  ismyTextFieldType!: boolean;
  confirmPasswordField!: boolean;
  isRegister: boolean = false;
  loginForm!: FormGroup;
  message!: string;
  color!: string;
  isLoading$!: Observable<boolean>;
  constructor(private dialogRef: MatDialogRef<AuthComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private toastController: ToastController,
    private authService: AuthService,
    private route: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
    this.isLoading$ = this.authService.isLoading$;
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  closeAuthDialog() {
    document
      .getElementsByClassName('animate__animated')[0]
      .classList.remove('animate__slideInLeft');
    document
      .getElementsByClassName('animate__animated')[0]
      .classList.add('animate__slideOutRight');
    setTimeout(() => {
      this.dialogRef.close();
    }, 1000);
  }

  togglemyPasswordFieldType() {
    this.ismyTextFieldType = !this.ismyTextFieldType;
  }

  //Open Dialog RegisterComponent
  openDialogRegister() {
    this.dialog.open(RegisterComponent, {
      width: '500px',
      height: '800px',
      disableClose: true,
      position: { right: '0px', top: '0px' },
      panelClass: ['animate__animated', 'animate__slideInRight', 'transform', 'duration-500', 'ease-out', 'origin-bottom'],
    })
    this.closeAuthDialog();
  }

  navigateToForgotPassword(){
    this.route.navigate(['forgot-password']);
    this.closeAuthDialog();
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

  formSubmit() {
    if (this.loginForm.invalid) {
      // Mark all form controls as touched to display the validation errors
      Object.values(this.loginForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.message = 'Input fields are invalid';
      this.color = 'danger';
      this.presentToast('top');
    } else {
      const {
        email,
        password
      } = this.loginForm.value;
      let obj = {
        email,
        password
      };
      this.authService.loginUser(obj).subscribe(
        response => {
          this.message = response.message || '';
          localStorage.setItem('token', JSON.stringify(response.token));
          localStorage.setItem('user', JSON.stringify(response.userName));
          this.color = 'success';
          this.presentToast('top');
          this.loginForm.reset();
          this.closeAuthDialog()
        },
        error => {
          console.error('Error placing order:', error);
          this.message = error;
          this.color = 'danger';
          this.presentToast('top');
        }
      )
    }
  }

}
