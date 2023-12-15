import { Component, Inject } from '@angular/core';
import {  MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-chowki-order-details',
  templateUrl: './chowki-order-details.component.html',
  styleUrls: ['./chowki-order-details.component.scss']
})
export class ChowkiOrderDetailsComponent {
  constructor
  (
    @Inject(MAT_DIALOG_DATA) public data: any,
    
  ) {}

  ngOnInit(){
    console.log('data',this.data);
  }
}
