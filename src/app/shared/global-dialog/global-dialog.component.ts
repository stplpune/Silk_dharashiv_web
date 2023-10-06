import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-global-dialog',
  templateUrl: './global-dialog.component.html',
  styleUrls: ['./global-dialog.component.scss'],
  standalone: true,
  imports: [ CommonModule,MatButtonModule, MatCardModule]
})
export class GlobalDialogComponent {
  constructor(public dialogRef: MatDialogRef<GlobalDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
   
  }

  closeDialog(result: string) {
    this.dialogRef.close(result);
  }

}
