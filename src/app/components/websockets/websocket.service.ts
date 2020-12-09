import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { OrderCreate, OrderResponse } from 'src/app/models';
import * as signalr from '@aspnet/signalr';
import { tap } from 'rxjs/operators';

export interface WebSocketState {
  orders: OrderResponse[]
}

@Injectable()
export class WebSocketStore extends ComponentStore<WebSocketState> {

  private hubConnection: signalr.HubConnection;

  constructor() {
    super({ orders: [] });
    this.hubConnection = new signalr.HubConnectionBuilder()
      .withUrl('http://localhost:1337/curbsidehub')
      .build();

      this.hubConnection.start()
        .then(() => console.log('Hub Connection Started'))
        .catch(err => console.error('Hub Connection Error', err));

      this.hubConnection.on('OrderPlaced', (order) => {
        this.addOrder(order);
      });
      this.hubConnection.on('OrderProcessed', (order) => {
        this.updateOrder(order);
      });
      this.hubConnection.on('ItemProcessed', (status) => {
        this.updateMessage(status);
      });
  }

  stopHub() {
    this.hubConnection.stop();
  }

  private readonly updateMessage = this.updater((state, status: {message: string, orderId: string}) => {
    const storedOrders = [...state.orders];
    storedOrders.find(o => o.id === status.orderId).message = status.message
    return {
      orders: [...storedOrders]
    }
  })
  private readonly updateOrder = this.updater((state, order: OrderResponse) => {
    const storedOrders = [...state.orders];
    storedOrders.find(o => o.id === order.id).status = order.status;
    storedOrders.find(o => o.id === order.id).pickupDate = order.pickupDate;
    storedOrders.find(o => o.id === order.id).message = null;

    return {
      orders: [...storedOrders]
    }
  })
  private readonly addOrder = this.updater((state, order:OrderResponse) => {
    return {
      orders: [order, ...state.orders]
    }
  })
  readonly orders$: Observable<OrderResponse[]> = this.select(state => state.orders);

  readonly createOrder = this.effect((order$: Observable<OrderCreate>) => {
    return order$.pipe(
      tap(order => this.hubConnection.send('PlaceOrder', order))
    )
  })
}
