import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-generate-pdf-silksamgra',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule,],
  templateUrl: './generate-pdf-silksamgra.component.html',
  styleUrls: ['./generate-pdf-silksamgra.component.scss']
})
export class GeneratePdfSilksamgraComponent {

}
