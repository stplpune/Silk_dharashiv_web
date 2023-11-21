import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateManaregaAppRoutingModule } from './create-manarega-app-routing.module';
import { CreateManaregaAppComponent } from './create-manarega-app.component';


@NgModule({
  declarations: [
    CreateManaregaAppComponent
  ],
  imports: [
    CommonModule,
    CreateManaregaAppRoutingModule
  ]
})
export class CreateManaregaAppModule { }
