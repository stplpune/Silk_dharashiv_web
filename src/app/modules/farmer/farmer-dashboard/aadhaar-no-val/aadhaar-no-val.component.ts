import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ValidationService } from 'src/app/core/services/validation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';

@Component({
  selector: 'app-aadhaar-no-val',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './aadhaar-no-val.component.html',
  styleUrls: ['./aadhaar-no-val.component.scss']
})
export class AadhaarNoValComponent {
  constructor(private validation: ValidationService, public dialogRef: MatDialogRef<AadhaarNoValComponent>, private encryptdecrypt: AesencryptDecryptService,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router) { }

  aadhaarNo = new FormControl('', [Validators.required, this.validation.maxLengthValidator(12), Validators.pattern(this.validation.aadhar_card)]);


  valAadhaarNo() {
    if (this.aadhaarNo.status == 'VALID') {
      let url = this.data == 1 ? 'create-manarega-app' : 'create-samgra-app';
      let Id: any = this.encryptdecrypt.encrypt(`${this.data}`);
      this.router.navigate([url], {
        queryParams: {
          id: Id
        },

      });
      this.onNoClick();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
