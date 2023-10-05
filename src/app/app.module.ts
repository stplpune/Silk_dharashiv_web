import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GlobalTableComponent } from './shared/global-table/global-table.component';
import { GlobalDialogComponent } from './shared/global-dialog/global-dialog.component';
import { ChangePasswordComponent } from './components/profile/change-password/change-password.component';

@NgModule({
  declarations: [
    AppComponent,
    GlobalTableComponent,
    GlobalDialogComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
