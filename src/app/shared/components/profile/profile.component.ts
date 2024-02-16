import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent  implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ProfileComponent>,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {}

  close() {
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

  toPlacedOrder(){
    this.router.navigate(['place-orders']);
    this.close()
  }

  toOrderHistory(){
    this.router.navigate(['order-history']);
    this.close()
  }

  clearLocal(){
    this.authService.logOut();
    this.close();
  }

}
