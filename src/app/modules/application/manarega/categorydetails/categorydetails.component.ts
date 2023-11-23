import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';


@Component({
  selector: 'app-categorydetails',
  standalone: true,
  imports: [CommonModule, MatRadioModule, MatIconModule, MatDialogModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './categorydetails.component.html',
  styleUrls: ['./categorydetails.component.scss']
})
export class CategorydetailsComponent {
  
  constructor(
    private dialogRef: MatDialogRef<CategorydetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  onOptionChange(event: any, i: number, label: string) {
    if (label == 'radio') {
      this.data.map((ele: any) => {
        if (ele?.isRadioButton) {
          ele.checked = false
        }
      });
      this.data[i].checked = true;
    } else {
      event.checked ? this.data[i].checked = true : this.data[i].checked = false;
    }
  }

  getSelectedItems() {
    this.dialogRef.close('yes');
  }
}
