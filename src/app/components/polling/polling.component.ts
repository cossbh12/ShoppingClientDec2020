import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PollingState, PollingStore } from './polling.service';

@Component({
  selector: 'app-polling',
  templateUrl: './polling.component.html',
  styleUrls: ['./polling.component.css'],
  providers: [PollingStore]
})
export class PollingComponent implements OnInit {

  orders$ = this.store.orders$;
  form = this.formBuilder.group({
    for: ['', [Validators.required]],
    items: ['', [Validators.required]]
  })
  constructor(private readonly store:PollingStore, private readonly formBuilder:FormBuilder) { }

  ngOnInit(): void {

  }

  submit() {
    this.store.createOrder(this.form.value);
    this.form.reset();
  }
  checkStatus(id:string):void {
    this.store.checkStatus(id);
  }
}
