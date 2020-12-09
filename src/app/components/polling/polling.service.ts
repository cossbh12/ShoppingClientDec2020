import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { OrderResponse, OrderCreate } from 'src/app/models';


export interface PollingState {
  orders: OrderResponse[]
}
@Injectable()
export class PollingStore extends ComponentStore<PollingState> {

  private tempId = 1;
  constructor(private readonly client:HttpClient) {
    super({ orders: []})
  }

  readonly orders$ : Observable<OrderResponse[]> = this.select(state => state.orders);

  readonly createOrder = this.effect((order$: Observable<OrderCreate>) => {
    return order$.pipe(
      switchMap(order => this.client.post<OrderResponse>('http://localhost:1337/async/curbsideorders', order)
        .pipe(
          tap(r => this.addOrder(r))
        )
      )
    )
  })

  readonly checkStatus = this.effect((orderId$: Observable<string>) => {
    return orderId$.pipe(
      switchMap(id => this.client.get<OrderResponse>(`http://localhost:1337/curbsideorders/${id}`)
        .pipe(
          tap(response => this.updateOrder(response))
        )

      )
    )
  })

  private readonly updateOrder = this.updater((state, order: OrderResponse) => {
    const storedOrders = [...state.orders];
    storedOrders.find(o => o.id === order.id).status = order.status;
    storedOrders.find(o => o.id === order.id).pickupDate = order.pickupDate;
    return {
      orders: [...storedOrders]
    }
  })
  private readonly addOrder = this.updater((state, order:OrderResponse) => {

    return {
      orders: [order, ...state.orders]
    }
  })
}
