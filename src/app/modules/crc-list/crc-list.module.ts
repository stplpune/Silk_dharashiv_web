import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CRCListRoutingModule } from './crc-list-routing.module';
import { CRCListComponent } from './crc-list.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { GlobalTableComponent } from "../../shared/components/global-table/global-table.component";
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    declarations: [
        CRCListComponent
    ],
    imports: [
        CommonModule,
        CRCListRoutingModule,
        MatFormFieldModule,
        MatCardModule,
        MatSelectModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatTableModule,
        MatButtonModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        GlobalTableComponent,
        TranslateModule
    ]
})
export class CRCListModule { 
  
}
