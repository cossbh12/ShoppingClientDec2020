import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap} from 'rxjs/operators';
import { OrderResponse } from 'src/app/models';
declare var $: any;

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.css']
})
export class SyncComponent implements OnInit {


  readonly baseUrl = 'http://localhost:1337/';
  form:FormGroup = this.formBuilder.group({
    for: ['', Validators.required],
    items: ['', Validators.required]
  })
  constructor(private client:HttpClient, private formBuilder:FormBuilder) { }
  order: OrderResponse = null;
  ngOnInit(): void {
    console.log($);
  }

  placeOrder(): void {
    console.log(this.form.value);
    $('#staticBackdrop').modal('show');
    this.client.post<OrderResponse>(`${this.baseUrl}sync/curbsideorders`, this.form.value)
    .pipe(
      tap(r =>{
        console.log(r);
        $('#staticBackdrop').modal('hide');
        this.order = r;
        this.form.reset()
      })
    ).subscribe();
  }
}
