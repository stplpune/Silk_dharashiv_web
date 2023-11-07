import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { VillageCircleRoutingModule } from './village-circle-routing.module';
import { VillageCircleComponent } from './village-circle.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { AddVillageComponent } from './add-village/add-village.component';
import { GlobalTableComponent } from "../../../../shared/global-table/global-table.component";
import { TranslateModule } from '@ngx-translate/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
    declarations: [
        VillageCircleComponent,
        AddVillageComponent
    ],
    imports: [
        CommonModule,
        VillageCircleRoutingModule,
        MatCardModule,
        MatInputModule,
        MatIconModule,
        MatDialogModule,
        MatTableModule,
        MatSelectModule,
        MatRadioModule,
        MatButtonModule,
        MatFormFieldModule,
        MatButtonModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        NgIf, MatInputModule,
        NgFor,
        MatRadioModule,
        MatIconModule,
        MatDialogModule,
        GlobalTableComponent,
        TranslateModule,
        NgxMatSelectSearchModule
    ]
})
export class VillageCircleModule { }
