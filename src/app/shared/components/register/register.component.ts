import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthComponent } from '../auth/auth.component';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';
import { ToastController } from '@ionic/angular';

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
  public loading: boolean = false;
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
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        alterEmail: ['', [Validators.required, Validators.email]],
        dob: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8)
          ],
        ],
        confirmPassword: ['', [Validators.required]],

        number: [
          '',
          [Validators.required, Validators.pattern('[- +()0-9]{10,12}')],
        ],
      },
      {
        validators: this.matchValidator('password', 'confirmPassword'),
      }
    );
  }

  matchValidator(
    controlName: string,
    matchingControlName: string
  ): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (
        matchingControl?.errors &&
        !matchingControl.errors['matchValidator']
      ) {
        return null;
      }

      if (control?.value !== matchingControl?.value) {
        const error = { matchValidator: 'Passwords do not match.' };
        matchingControl?.setErrors(error);
        return error;
      } else {
        matchingControl?.setErrors(null);
        return null;
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  togglemyPasswordFieldType() {
    this.ismyTextFieldType = !this.ismyTextFieldType;
  }

  confirmPasswordToggle() {
    this.confirmPasswordField = !this.confirmPasswordField;
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
    if (this.registerForm.invalid) {
      // Mark all form controls as touched to display the validation errors
      Object.values(this.registerForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.message = 'Input fields are invalid';
      this.color = 'danger';
      this.presentToast('top');
    } else {
      const {
        firstName,
        lastName,
        alterEmail,
        dob,
        email,
        password,
        confirmPassword,
        number
      } = this.registerForm.value;
      let obj = {
        firstName,
        lastName,
        alterEmail,
        dob,
        email,
        password,
        confirmPassword,
        number
      };
      this.authService.registerUser(obj).subscribe(
        response => {
          this.loading = true;
          this.message = response.message || '';
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
}
