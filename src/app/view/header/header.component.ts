import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subject, debounceTime, distinctUntilChanged, filter, fromEvent, map, skipWhile, take, tap } from 'rxjs';
import { AuthComponent } from 'src/app/shared/components/auth/auth.component';
import { ProfileComponent } from 'src/app/shared/components/profile/profile.component';
import { SideBarComponent } from 'src/app/shared/components/side-bar/side-bar.component';
import { AuthService } from 'src/app/shared/service/auth/auth.service';
import { Product } from 'src/app/shared/service/cart/Product';
import { ProductService } from 'src/app/shared/service/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  dialogRef!: MatDialogRef<SideBarComponent>;
  @ViewChild('search') search!: ElementRef;

  filteredProducts: Product[] = [];

  private searchSubject: Subject<string> = new Subject<string>();
  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private productService: ProductService,
    private navCtrl: NavController,
    private router: Router) { }
  ngOnInit() { }

  ngAfterViewInit(): void {
    this.initSearchTrigger();
  }

  initSearchTrigger() {
    fromEvent(this.search?.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(700),
        map(() => this.search?.nativeElement?.value.trim()),
        distinctUntilChanged(),
        tap((searchVal) => {
          if (searchVal.length > 0 || searchVal === '') {
            this.productService.searchProduct(searchVal).pipe(skipWhile(val => !val), take(1)).subscribe(
              (res: any) => {
                console.log(res.products);
                this.filteredProducts = res.products
              }
            )
          }
        })
      )
      .subscribe();
  }


  productDetail(product: any) {
    if (product && product.discountedPrice !== undefined && product.productDiscount !== 0) {
      this.navCtrl.navigateForward(`/product-sale-detail/${product._id}`);
      this.filteredProducts = [];
    } else if (product && product.productDiscount !== undefined && product.productDiscount === 0) {
      this.navCtrl.navigateForward(`/product-detail/${product._id}`);
      this.filteredProducts = [];
    }
  }

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
      height: '150px',
      position: { right: '0px', top: '70px' },
      panelClass: ['animate__animated', 'animate__slideInRight'],
    });
  }

  navigateHeader(route: string) {
    console.log("Router", route)
    this.router.navigate([`/${route}`]);
  }



  isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
