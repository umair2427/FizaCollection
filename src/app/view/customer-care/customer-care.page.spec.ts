import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerCarePage } from './customer-care.page';

describe('CustomerCarePage', () => {
  let component: CustomerCarePage;
  let fixture: ComponentFixture<CustomerCarePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CustomerCarePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
