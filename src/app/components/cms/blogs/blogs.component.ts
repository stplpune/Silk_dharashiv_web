import { Component } from '@angular/core';
import { AddBlogsComponent } from './add-blogs/add-blogs.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent {

  constructor(public dialog: MatDialog) {}

  addblogs(){
    this.dialog.open(AddBlogsComponent,{
      width:'60%'
    })
  }

}
