
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-technical-estimate',
  templateUrl: './technical-estimate.component.html',
  styleUrls: ['./technical-estimate.component.scss'],
  imports: [RouterLink, MatCardModule, MatButtonModule]
})
export class TechnicalEstimateComponent {

}
