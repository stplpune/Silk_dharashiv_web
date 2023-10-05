import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlockCircleRoutingModule } from './block-circle-routing.module';
import { BlockCircleComponent } from './block-circle.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatRadioModule} from '@angular/material/radio';


@NgModule({
  declarations: [
    BlockCircleComponent
  ],
  imports: [
    CommonModule,
    BlockCircleRoutingModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule
  ]
})
export class BlockCircleModule { }
