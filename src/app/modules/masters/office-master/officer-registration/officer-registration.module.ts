import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficerRegistrationRoutingModule } from './officer-registration-routing.module';
import { OfficerRegistrationComponent } from './officer-registration.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RegisterOfficerComponent } from './register-officer/register-officer.component';
import {MatDialogModule} from '@angular/material/dialog';
import { GlobalTableComponent } from "../../../../shared/components/global-table/global-table.component";
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
    declarations: [
        OfficerRegistrationComponent,
        RegisterOfficerComponent
    ],
    imports: [
        CommonModule,
        OfficerRegistrationRoutingModule,
        MatCardModule,
        MatInputModule,
        MatIconModule,
        MatTableModule,
        MatSelectModule,
        MatDialogModule,
        MatRadioModule,
        MatButtonModule,
        GlobalTableComponent,
        ReactiveFormsModule,FormsModule,
        TranslateModule,
        NgxMatSelectSearchModule
    ]
})
export class OfficerRegistrationModule { }
