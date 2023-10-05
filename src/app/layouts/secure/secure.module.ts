import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecureRoutingModule } from './secure-routing.module';
import { SecureComponent } from './secure.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SideBarComponent } from './sidebar/sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    SecureComponent,
    FooterComponent,
    SideBarComponent
  ],
  imports: [
    CommonModule,
    HeaderComponent,
    SecureRoutingModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class SecureModule { }
