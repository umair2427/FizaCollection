import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from 'src/app/shared/service/product.service';
import { ProductViewComponent } from '../../shared/components/product-view/product-view.component';
import { PageEvent } from '@angular/material/paginator'; // Import PageEvent for pagination

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
  products: any[] = [];
  filteredProducts: any[] = [];

  lowerValue: number = 0;
  upperValue: number = 100;
  page = 1;
  pageSize = 12; 
  totalProducts = 0; 

  showPrice: boolean = true;
  showCategory: boolean = true;
  clearFilter: boolean = false;
  itemNotFound: boolean = false;
  loading: boolean = false;

  selectedCategory: string | undefined;

  public SortOption = SortOption;
  selectedSortOption: SortOption = SortOption.SORT;

  radioPrice = null;
  search: any;
  categories: string[] = [
    'Top', '2 Piece Suit', '3 Piece Suit', 'Flapper', 'Jeans', 'Capri', 
    'Trouser', 'Lehnga', 'Dupatta', 'Thigts'
  ];

  constructor(public dialog: MatDialog, private productService: ProductService) { }

  ngOnInit() {
    this.loadProducts();
  }

  // Load products based on current page, pageSize, and selected category
  private loadProducts() {
    this.loading = true;

    this.productService.getSaleProducts(this.page, this.pageSize, this.selectedCategory).subscribe(
      (data: { totalProducts: number, products: any[] }) => {
        this.products = data.products;
        this.filteredProducts = this.products;
        this.totalProducts = data.totalProducts;
        this.loading = false;
      },
      (error: Error) => {
        console.error(error);
        this.loading = false;
      }
    );
  }

  // Handle page change event for paginator
  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1; 
    this.pageSize = event.pageSize;
    this.loadProducts(); 
  }

  openDialog(pro: any) {
    this.dialog.open(ProductViewComponent, {
      width: '700px',
      height: '550px',
      data: pro,
      disableClose: true,
    });
  }

  // Sort function
  sortProducts(option: SortOption) {
    switch (option) {
      case SortOption.SORT:
        this.clearFilter = false;
        this.filteredProducts = [...this.products];
        break;
      case SortOption.NEWEST:
        this.filteredProducts = this.filteredProducts.sort(
          (a, b) => (a.productDateTime?.getTime() || 0) - (b.productDateTime?.getTime() || 0)
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

  // Price Range
  priceFilter(event: any) {
    const selectedPrice = parseInt(event.target.value, 10);
    this.filteredProducts = this.products.filter((product) => {
      this.clearFilter = true;
      this.itemNotFound = false;
      return (product.productPrice || 0) >= selectedPrice && (product.productPrice || 0) < selectedPrice + 1000;
    });
    if (this.filteredProducts.length === 0) {
      this.itemNotFound = true;
    }
  }

  // Category
  arrangeByCategory(event: any) {
    this.selectedCategory = event;
    this.loadProducts();
  }

  reset() {
    this.clearFilter = false;
    this.radioPrice = null;
    this.itemNotFound = false;
    this.filteredProducts = [...this.products];
  }
}
