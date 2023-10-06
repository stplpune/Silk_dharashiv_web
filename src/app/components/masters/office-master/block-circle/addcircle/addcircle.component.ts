import { Component } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgIf, NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';import {MatRadioModule} from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-addcircle',
  templateUrl: './addcircle.component.html',
  styleUrls: ['./addcircle.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule,MatButtonModule, MatSelectModule, FormsModule, ReactiveFormsModule, NgIf,MatInputModule, NgFor,MatRadioModule,MatIconModule,MatDialogModule],
})
export class AddcircleComponent {



  toppings = new FormControl('');

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
}
