import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/validation.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent {
  departmentFrm!: FormGroup;
  filterFrm!: FormGroup;
  editFlag: boolean = false;
  tableDataArray = new Array();
  tableDatasize!: number;
  totalPages!: number;
  pageNumber: number = 1;
  highLightRowFlag: boolean = false;
  displayedColumns: string[] = ['srno', 'departmentname', 'action'];
  @ViewChild('formDirective') private formDirective!: NgForm;
  dataSource = ELEMENT_DATA;

  constructor(private fb: FormBuilder,  public validator: ValidationService,) { }

  ngOnInit() {
    this.defaultFrm();
    this.filterDefaultFrm();

  }

  defaultFrm(data?: any) { 
    this.departmentFrm = this.fb.group({
      id: [data ? data.id : 0],
      departmentName: [data ? data.departmentName : '', Validators.required],
      m_DepartmentName: [data ? data.m_DepartmentName : ''],
    })
  }

  filterDefaultFrm() {
    this.filterFrm = this.fb.group({
      TextSearch: [''],
    })
  }

  onEditData(receiveObj: any) {
    this.editFlag = true;
    this.defaultFrm(receiveObj);
  }

  clearSearchFilter() {  // for clear search field
    this.filterFrm.reset();
  }

  clearFormData() { // for clear Form field
    this.formDirective?.resetForm();
  }
}

export interface PeriodicElement {
  srno: number;
  departmentname: string;
  action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { srno: 1, departmentname: 'Hydrogen', action: ' ' }
];
