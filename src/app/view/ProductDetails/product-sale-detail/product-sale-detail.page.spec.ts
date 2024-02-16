import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSaleDetailPage } from './product-sale-detail.page';

describe('ProductSaleDetailPage', () => {
  let component: ProductSaleDetailPage;
  let fixture: ComponentFixture<ProductSaleDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProductSaleDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
