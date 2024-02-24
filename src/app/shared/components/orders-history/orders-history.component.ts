import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../service/order/order.service';

@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss'],
})
export class OrdersHistoryComponent  implements OnInit {
  orders: any[] = [];
  email:string = 'example@email.com';
  parseData!: any;
  innerArray: number[][] = [];
  innerArrayLength: number[] = [];
  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getAllOrder().subscribe((res: any) => {
      this.orders = res.orders;
      console.log(this.orders);

      this.innerArray = this.orders.map((item: any) => JSON.parse(item.products));
      this.innerArrayLength = this.innerArray.map((item: number[]) => item.length);
    });
  }

}
