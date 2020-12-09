import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { OrderResponse } from 'src/app/models';
import { WebSocketStore } from './websocket.service';

@Component({
  selector: 'app-websockets',
  templateUrl: './websockets.component.html',
  styleUrls: ['./websockets.component.css'],
  providers: [WebSocketStore]
})
export class WebsocketsComponent implements OnInit, OnDestroy {

  orders$: Observable<OrderResponse[]>;
  form = this.formBuilder.group({
    for: ['', Validators.required],
    items: ['', Validators.required]
  })
  constructor(
    private readonly formBuilder:FormBuilder,
    private readonly store: WebSocketStore) { }

  ngOnInit(): void {
    this.orders$ = this.store.orders$;
  }

  ngOnDestroy():void {
    this.store.stopHub();
  }

  submit():void {
    this.store.createOrder(this.form.value);
    this.form.reset();
  }

}
