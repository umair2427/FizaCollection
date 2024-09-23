import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../service/auth/auth.service';
import { AuthComponent } from '../auth/auth.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  ismyTextFieldType!: boolean;
  confirmPasswordField!: boolean;
  message!: string;
  color!: string;

  isLoading$!: Observable<boolean>;
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AuthComponent>,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastController: ToastController
  ) { }
  registerForm!: FormGroup;
  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        dob: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        number: [
          '',
          [Validators.required, Validators.pattern('[- +()0-9]{10,12}')],
        ],
      },
    );
    this.isLoading$ = this.authService.isLoading$;

  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  //Open Dialog AuthComponent
  openDialogAuth() {
    this.dialog.open(AuthComponent, {
      width: '500px',
      height: 'auto',
      disableClose: true,
      position: { right: '0px', top: '60px' },
      panelClass: ['animate__animated', 'animate__slideInRight'],
    });
    setTimeout(() => {
      this.closeRegisterDialog();
    }, 1000);
  }

  closeRegisterDialog() {
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
    const {
      name,
      dob,
      email,
      number
    } = this.registerForm.value;
    let payload = {
      name,
      dob,
      email,
      number
    };
    this.authService.registerUser(payload).subscribe(
      response => {
        this.message = 'Register successfully and password reset email sent';
        this.color = 'success';
        this.presentToast('top');
        this.registerForm.reset();
        this.openDialogAuth();
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
