import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalProcessSilkSamgraRoutingModule } from './approval-process-silk-samgra-routing.module';
import { ApprovalProcessSilkSamgraComponent } from './approval-process-silk-samgra.component';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { DashPipe } from 'src/app/core/Pipes/dash.pipe';
import { ConfigService } from 'src/app/core/services/config.service';


@NgModule({
  declarations: [
    ApprovalProcessSilkSamgraComponent
  ],
  imports: [
    CommonModule,
    ApprovalProcessSilkSamgraRoutingModule,
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
    TranslateModule,
    AgmCoreModule.forRoot(ConfigService.googleApiObj),
  ]
})
export class ApprovalProcessSilkSamgraModule { }
