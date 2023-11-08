import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalProcessRoutingModule } from './approval-process-routing.module';
import { ApprovalProcessComponent } from './approval-process.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { DashPipe } from 'src/app/core/Pipes/dash.pipe';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { GeoTaggingComponent } from './geo-tagging/geo-tagging.component';
import { ConfigService } from 'src/app/core/services/config.service';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    ApprovalProcessComponent,
    ViewDetailsComponent,
    GeoTaggingComponent,
  ],
  imports: [
    CommonModule,
    ApprovalProcessRoutingModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    DashPipe,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonToggleModule,
    AgmCoreModule.forRoot(ConfigService.googleApiObj),
  ]
})
export class ApprovalProcessModule { }
