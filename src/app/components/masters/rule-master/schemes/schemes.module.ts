import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchemesRoutingModule } from './schemes-routing.module';
import { SchemesComponent } from './schemes.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { GlobalTableComponent } from "../../../../shared/global-table/global-table.component";
import { TranslateModule } from '@ngx-translate/core';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AddSchemeComponent } from './add-scheme/add-scheme.component';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
    declarations: [
        SchemesComponent,
        AddSchemeComponent
    ],
    imports: [
        CommonModule,
        SchemesRoutingModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatIconModule,
        MatTableModule,
        MatButtonModule,
        MatSelectModule,
        ReactiveFormsModule,
        GlobalTableComponent,
        TranslateModule,
        AngularEditorModule
    ]
})
export class SchemesModule { }
