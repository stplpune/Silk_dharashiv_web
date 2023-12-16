import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { Subscription } from 'rxjs';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [CommonModule, MatRadioModule, MatIconModule, MatDialogModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss']
})
export class CategoryDetailsComponent {
  subscription!: Subscription;
  lang: any;
  constructor(
    public commonMethod: CommonMethodsService,
    private WebStorageService : WebStorageService,
    public dialogRef: MatDialogRef<CategoryDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
  }


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
    let checkedCategory = this.data.some((category: any) => category.checked);
    if (!checkedCategory) {
      this.commonMethod.snackBar('Please select at least one category.', 1);
      return;
    }
    else {
      this.dialogRef.close(this.data);
    }
  }
}
