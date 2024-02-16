import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthComponent } from 'src/app/shared/components/auth/auth.component';
import { ProfileComponent } from 'src/app/shared/components/profile/profile.component';
import { RegisterComponent } from 'src/app/shared/components/register/register.component';
import { SideBarComponent } from 'src/app/shared/components/side-bar/side-bar.component';
import { AuthService } from 'src/app/shared/service/auth/auth.service';

interface ImageObject {
  id: number;
  imageUrl: string;
  name: string;
  price: number;
  discountPrice: number;
  createdAt: Date;
  category: string;
  description: string;
  quantity: number;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  dialogRef!: MatDialogRef<SideBarComponent>;
  filteredProducts: ImageObject[] = [];
  user: string = this.authService.user || '';
  constructor(public dialog: MatDialog, private authService: AuthService) { }
  searchQuery: string = '';
  //Open Dialog SideBarComponent
  openDialog() {
    this.dialog.open(SideBarComponent, {
      disableClose: true,
      width: '400px',
      height: 'auto',
      position: { right: '0px', top: '0px' },
      panelClass: ['animate__animated', 'animate__slideInRight'],
    });
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
  }

  openProfileDialog() {
    this.dialog.open(ProfileComponent, {
      disableClose: true,
      width: '300px',
      height: '320px',
      position: { right: '0px', top: '70px' },
      panelClass: ['animate__animated', 'animate__slideInRight'],
    });
  }
  ngOnInit() { }

  public product: ImageObject[] = [
    {
      id: 1,
      imageUrl:
        'https://static.wixstatic.com/media/cda177_f95b14c95d6446de847782f0b6fd0027.png/v1/fill/w_299,h_353,al_c,q_90,usm_0.66_1.00_0.01/cda177_f95b14c95d6446de847782f0b6fd0027.webp',
      name: 'MIDI PLEATED SKIRT',
      price: 1590,
      discountPrice: 1450,
      createdAt: new Date('2023-09-26T10:00:00'),
      category: 'Skirt',
      description:
        "I'm a product description. I’m a great place to include more information about your product. Buyers like to know what they’re getting before they purchase.",
      quantity: 1,
    },
    {
      id: 2,
      imageUrl:
        'https://static.wixstatic.com/media/cda177_b5a795ade21b41d38cadd836824e6768.jpg/v1/fill/w_299,h_409,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/cda177_b5a795ade21b41d38cadd836824e6768.jpg',
      name: 'Sale',
      price: 1590,
      discountPrice: 800,
      createdAt: new Date('2023-08-26T10:00:00'),
      category: 'Bag',
      description:
        "I'm a product description. I’m a great place to include more information about your product. Buyers like to know what they’re getting before they purchase.",
      quantity: 1,
    },
    {
      id: 3,
      imageUrl:
        'https://static.wixstatic.com/media/84770f_9a81715dcb4b43fa936d243fcd90e2a9.png/v1/fill/w_299,h_353,al_c,q_90,usm_0.66_1.00_0.01/84770f_9a81715dcb4b43fa936d243fcd90e2a9.webp',
      name: 'VINTAGE FRAME EYEGLASSES',
      price: 1590,
      discountPrice: 1050,
      createdAt: new Date('2022-09-28T10:00:00'),
      category: 'Glasses',
      description:
        "I'm a product description. I’m a great place to include more information about your product. Buyers like to know what they’re getting before they purchase.",
      quantity: 1,
    },
    {
      id: 4,
      imageUrl:
        'https://static.wixstatic.com/media/cda177_467ce979b6924fe689b1347d7a982f3c.png/v1/fill/w_226,h_226,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/cda177_467ce979b6924fe689b1347d7a982f3c.png',
      name: "I'm a Product",
      price: 1499,
      discountPrice: 1200,
      createdAt: new Date('2021-10-26T10:50:00'),
      category: 'Skirt',
      description:
        "I'm a product description. I’m a great place to include more information about your product. Buyers like to know what they’re getting before they purchase.",
      quantity: 1,
    },
    {
      id: 5,
      imageUrl:
        'https://static.wixstatic.com/media/cda177_95cd2230351d454e8fd76b7545766138.png/v1/fill/w_226,h_226,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/cda177_95cd2230351d454e8fd76b7545766138.png',
      name: "I'm a Product",
      price: 1999,
      discountPrice: 1500,
      createdAt: new Date('2021-10-26T10:51:00'),
      category: 'Shirt',
      description:
        "I'm a product description. I’m a great place to include more information about your product. Buyers like to know what they’re getting before they purchase.",
      quantity: 1,
    },
    {
      id: 6,
      imageUrl:
        'https://static.wixstatic.com/media/cda177_eb61b785ee834218a45a9fad11e1d19b.png/v1/fill/w_226,h_226,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/cda177_eb61b785ee834218a45a9fad11e1d19b.png',
      name: "I'm a Product",
      price: 1999,
      discountPrice: 1200,
      createdAt: new Date('2022-05-02T10:00:00'),
      category: 'Shoes',
      description:
        "I'm a product description. I’m a great place to include more information about your product. Buyers like to know what they’re getting before they purchase.",
      quantity: 1,
    },
    {
      id: 7,
      imageUrl:
        'https://static.wixstatic.com/media/cda177_f1f82c1c2f2f42df9e23af0c01bf10aa.png/v1/fill/w_226,h_226,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/cda177_f1f82c1c2f2f42df9e23af0c01bf10aa.png',
      name: "I'm a Product",
      price: 1900,
      discountPrice: 1000,
      createdAt: new Date('2010-11-26T10:00:00'),
      category: 'Shirt',
      description:
        "I'm a product description. I’m a great place to include more information about your product. Buyers like to know what they’re getting before they purchase.",
      quantity: 1,
    },
    {
      id: 8,
      imageUrl:
        'https://static.wixstatic.com/media/cda177_1c16f70e659f4d0d9f48b5d2f4f211f2.png/v1/fill/w_226,h_226,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/cda177_1c16f70e659f4d0d9f48b5d2f4f211f2.png',
      name: "I'm a Product",
      price: 1900,
      discountPrice: 1500,
      createdAt: new Date('2015-09-16T10:00:00'),
      category: 'Rope',
      description:
        "I'm a product description. I’m a great place to include more information about your product. Buyers like to know what they’re getting before they purchase.",
      quantity: 1,
    },
    {
      id: 9,
      imageUrl:
        'https://static.wixstatic.com/media/cda177_1fbd6bdcacca487d80040668c1e587f2.png/v1/fill/w_226,h_226,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/cda177_1fbd6bdcacca487d80040668c1e587f2.png',
      name: "I'm a Product",
      price: 1900,
      discountPrice: 1800,
      createdAt: new Date('2013-12-26T10:00:00'),
      category: 'Shirt',
      description:
        "I'm a product description. I’m a great place to include more information about your product. Buyers like to know what they’re getting before they purchase.",
      quantity: 1,
    },
  ];
  // filteredProducts: ImageObject[] = this.product.slice();

  onSearchElement() {
    this.filteredProducts = this.product.filter((product) => {
      return product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
    });
    console.log("product", this.filteredProducts);

  }

  isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
