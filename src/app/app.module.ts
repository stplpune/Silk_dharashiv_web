import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ApiService } from './core/services/api.service';

export function httpTranslateLoaderFactory(http: HttpClient) {
  // export HttpLoaderFactory function that allows NGX-Translate to dynamically load translation files from a server or 
  //local folder and make them available for translation.
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [DatePipe,
    ApiService, {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true // option. This is required and tells Angular that HTTP_INTERCEPTORS is an array of values, rather than a single value.
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
