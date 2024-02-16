import { Component, OnInit } from '@angular/core';
import { ProductViewComponent } from '../../shared/components/product-view/product-view.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/shared/service/product.service';
import { Product } from '../../shared/service/cart/Product';

enum SortOption {
  SORT = 'sort',
  NEWEST = 'newest',
  PRICE_LOW_TO_HIGH = 'price1',
  PRICE_HIGH_TO_LOW = 'price2',
  NAME_A_TO_Z = 'name1',
  NAME_Z_TO_A = 'name2',
}

interface items {
  id?: number;
  name?: string;
  data?: any;
}

@Component({
  selector: 'app-sale',
  templateUrl: './sale.page.html',
  styleUrls: ['./sale.page.scss'],
})
export class SalePage implements OnInit {
  products: Product[] = [];
  lowerValue: number = 1;
  upperValue: number = 2000;
  showPrice: boolean = true;
  showCategory: boolean = true;
  selectedCategory: string | undefined;
  public SortOption = SortOption;
  selectedSortOption: SortOption = SortOption.SORT;
  clearFilter: boolean = false;
  itemNotFound: boolean = false;
  radioPrice = null;
  search: any;
  filteredProducts: Product[] = [];
  categories: items[] = [];
  loading = false;
  page = 1;
  pageSize = 9;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private productService: ProductService,
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.showCategories();
  }


  loadData(event: any) {
    this.page++;
    this.loadProducts(event);
  }

  private loadProducts(event?: any) {
    this.loading = true;
    this.productService.getSaleProducts(this.page, this.pageSize).subscribe(
      (data: { totalCount: number, products: Product[] }) => {
        this.products = this.products.concat(data.products);

        // Filter products with discounts
        this.filteredProducts = this.products.filter(product =>
          product.productDiscount !== undefined && +product.productDiscount !== 0
        );

        this.loading = false;

        if (event) {
          event.target.complete();
        }

        // Check if all items are loaded
        if (this.products.length >= data.totalCount) {
          if (event) {
            event.target.disabled = true;  // Disable infinite scroll
          }
        }
      },
      (error: Error) => {
        console.error(error);
        this.loading = false;

        if (event) {
          event.target.complete();
        }
      }
    );
  }


  //Open Dialog
  openDialog(pro: Product) {
    this.dialog.open(ProductViewComponent, {
      width: '700px',
      height: '550px',
      data: pro,
      disableClose: true
    });
  }

  viewProductDetails(id: number) {
    this.search = this.products.find((element: any) => {
      return element.id === id;
    });
    this.openDialog(this.search);
  }

  // Sorting options

  // Sort function
  sortProducts(option: SortOption) {

    switch (option) {
      case SortOption.SORT:
        this.clearFilter = false;
        this.filteredProducts = [...this.products];
        break;
      case SortOption.NEWEST:
        this.filteredProducts = this.filteredProducts.sort(
          (a, b) => (a.productDateTime ? new Date(a.productDateTime).getTime() : 0) - (b.productDateTime ? new Date(b.productDateTime).getTime() : 0)
        );
        break;
      case SortOption.PRICE_LOW_TO_HIGH:
        this.filteredProducts = this.filteredProducts.sort(
          (a, b) => (a.productPrice || 0) - (b.productPrice || 0)
        );
        break;
      case SortOption.PRICE_HIGH_TO_LOW:
        this.filteredProducts = this.filteredProducts.sort(
          (a, b) => (b.productPrice || 0) - (a.productPrice || 0)
        );
        break;
      case SortOption.NAME_A_TO_Z:
        this.filteredProducts = this.filteredProducts.sort((a, b) =>
          (a.productName || '').localeCompare(b.productName || '')
        );
        break;
      case SortOption.NAME_Z_TO_A:
        this.filteredProducts = this.filteredProducts.sort((a, b) =>
          (b.productName || '').localeCompare(a.productName || '')
        );
        break;
      default:
        break;
    }
  }

  //Price Range
  priceFilter(event: any) {
    const selectedPrice = parseInt(event.target.value, 10);
    this.clearFilter = true;
    this.itemNotFound = false;

    this.filteredProducts = this.products.filter((product) => {
      if (product.discountedPrice !== undefined && product.discountedPrice !== null && product.productDiscount !== 0) {
        const discountedPrice = parseFloat(product.discountedPrice);
        if (!isNaN(discountedPrice)) {
          return discountedPrice >= selectedPrice && discountedPrice < selectedPrice + 500;
        }
      }
      return false;
    });

    if (this.filteredProducts.length === 0) {
      this.itemNotFound = true;
    }
  }



  //Category
  arrangeByCategory(event: any) {
    const selectedCategoryId = event.value;
    this.filteredProducts = this.products.filter((product) => {
      this.clearFilter = true;
      this.itemNotFound = false;

      return product.categoryId === selectedCategoryId;
    });

    if (this.filteredProducts.length === 0) {
      this.itemNotFound = true;
    }
  }

  showCategories() {
    this.productService.getCategories().subscribe((res: any) => {
      this.categories = res.data;
    },
      (error) => {
        console.error('Error fetching categories:', error);
      })
  }
  reset() {
    this.clearFilter = false;
    this.radioPrice = null;
    this.itemNotFound = false;
    this.filteredProducts = this.products.filter(product => product.productDiscount !== undefined && +product.productDiscount !== 0);
  }


}
