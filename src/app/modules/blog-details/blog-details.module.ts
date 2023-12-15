import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';

import { BlogDetailsRoutingModule } from './blog-details-routing.module';
import { BlogDetailsComponent } from './blog-details.component';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [
    BlogDetailsComponent
  ],
  imports: [
    CommonModule,
    BlogDetailsRoutingModule,
    MatPaginatorModule,
    MatIconModule,
    MatCardModule
  ]
})
export class BlogDetailsModule { }
