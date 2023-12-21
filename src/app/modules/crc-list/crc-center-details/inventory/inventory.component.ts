import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReplaySubject, Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { MasterService } from 'src/app/core/services/master.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,ReactiveFormsModule,NgxMatSelectSearchModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent {
  filterForm!:FormGroup;
  tableDataArray: any;
  tableDatasize!: number;
  totalPages!: number;
  highLightedFlag: boolean = true;
  filterFlag: boolean = false;
  pageNumber: number = 1;
  subscription!: Subscription;
  lang: string = 'English';
  grainageCtrl: FormControl = new FormControl();
  grainageSubject: ReplaySubject<any> = new ReplaySubject<any>();
  grainageArray = new Array();
  grainageTypeArray = new Array();
  constructor
  (
    public dialog:MatDialog,
    public webService: WebStorageService,
    private fb: FormBuilder,
    private commonMethod: CommonMethodsService,
    private masterService: MasterService,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private errorHandler: ErrorHandlingService,
    public validation: ValidationService,
  ){}

  ngOnInit(){
    this.subscription = this.webService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    });
    this.getFormData();
    this.searchDataZone();
    this.getGrainage();
    this.getGrainagetype();
    this.getTableData();
  }

  getFormData() {
    this.filterForm = this.fb.group({
    grainageId:[0],
    gTypeId:[0],
    searchText:['']
    })
  }

  searchDataZone() {
    this.grainageCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.grainageArray, this.grainageCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.grainageSubject) });
  }

  getGrainage() {
    this.masterService.GetGrainageWithTypeandState().subscribe({
      next: ((res: any) => {
        this.grainageArray = res.responseData;
        this.grainageArray.unshift({ id: 0, textEnglish: 'All Grainage', textMarathi: 'सर्व धान्य' }),
          this.commonMethod.filterArrayDataZone(this.grainageArray, this.grainageCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.grainageSubject);
      }), error: (() => {
        this.grainageArray = [];
      })
    })
  }

  getGrainagetype() {
    this.masterService.GetGrainageType().subscribe({
      next: ((res: any) => {
        this.grainageTypeArray = res.responseData;
      }), error: (() => {
        this.grainageTypeArray = [];
      })
    })
  }

  getTableData(flag?: any) {
    this.spinner.show();
    let formData = this.filterForm.getRawValue(); 
    flag == 'filter' ? this.pageNumber = 1 : ''
    let str = `&PageNo=${this.pageNumber}&PageSize=10`;
    console.log(str,formData);
    this.apiService.setHttp('GET', '', false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {          
          this.tableDataArray = res.responseData1;      
          this.tableDatasize = res.responseData2?.totalCount;
          this.totalPages = res.responseData2?.totalPages;
        } else {
          this.spinner.hide();
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : '';
          this.tableDataArray = []; this.tableDatasize = 0;
        }
        this.setTableData();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandler.handelError(err.status);
      },
    });
  }
  
  setTableData() {
    this.highLightedFlag = true;
    let displayedColumns = this.lang == 'en' ? ['srNo', 'orderId', 'grainage', 'state','location', 'type', 'orderedQty','orderDate','status1','action']
      : ['srNo', 'orderId', 'm_Grainage', 'm_state','location', 'm_type', 'orderedQty','orderDate','status1','action'];
    let displayedheaders = this.lang == 'en' ? ['Sr. No.','Grainage', 'Type', 'State','Lot No','Race','purchase Quantity(Eggs)','In Stock'] :
      ['अनुक्रमांक','धान्य','प्रकार','राज्य','लॉट नंबर','शर्यत','खरेदीचे प्रमाण (अंडी)','स्टॉक मध्ये'];
    let tableData = {
      pageNumber: this.pageNumber,
      pagination: this.tableDatasize > 10 ? true : false,
      highlightedrow: true,
      isBlock: '',
      date: '',
      dates:'',
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      view: true,
      edit: false,
      delete: false
    };
    this.highLightedFlag ? tableData.highlightedrow = true : tableData.highlightedrow = false;    
    this.apiService.tableData.next(tableData);
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        !this.filterFlag ? this.getFormData() : ''
        this.getTableData();
        break;
    }
  }

  clearFormData(){
    
  }

}
