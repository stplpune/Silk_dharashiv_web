import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-categorydetails',
  templateUrl: './categorydetails.component.html',
  styleUrls: ['./categorydetails.component.scss']
})
export class CategorydetailsComponent {
  radioButtonData: any[] = [];
  checkBoxData: any[] = [];
 
  constructor(
    private dialogRef: MatDialogRef<CategorydetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {  }

  

  ngOnInit(){
    this.filterData();
  }


  filterData(){
    this.radioButtonData = this.data.filter((item:any) => item.isRadioButton === 1);
    this.checkBoxData = this.data.filter((item:any) => item.isCheckBox === 1);
    console.log( this.checkBoxData)
  }

  

  
  selectedOption:any; 

  onOptionChange(option: any) {
    this.selectedOption = option;
    console.log('Selected option:', this.selectedOption);
  }

  
  selectedItems: any[] = [];
 arrayData: any[] = [];

  onCheckboxChange(item: any) {
     const index = this.selectedItems.indexOf(item);// Check if the item is already in the selectedItems array
  if (index === -1) {
      this.selectedItems.push(item);// If not found, add the item to the array
    } else {
      this.selectedItems.splice(index, 1);// If found, remove the item from the array
    }
    console.log('this.selectedItems', this.selectedItems);
   
  }


  getSelectedItems() {
    this.arrayData = [...this.selectedItems,this.selectedOption];
    // this.dialogRef.close('Yes');
    this.dialogRef.close( this.arrayData);
    console.log(" this.arrayData", this.arrayData)
   
  }





}
