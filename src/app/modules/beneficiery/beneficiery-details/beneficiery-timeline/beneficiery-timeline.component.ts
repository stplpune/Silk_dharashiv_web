import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { GlobalTableComponent } from 'src/app/shared/components/global-table/global-table.component';
import { ActivatedRoute } from '@angular/router';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-beneficiery-timeline',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    GlobalTableComponent,
    TranslateModule,
    MatPaginatorModule
  ],
  templateUrl: './beneficiery-timeline.component.html',
  styleUrls: ['./beneficiery-timeline.component.scss']
})
export class BeneficieryTimelineComponent {

  pageNumber: number = 1;
  tableDataArray = new Array();
  tableDatasize!: number;
  totalPages!: number;
  highLightRowFlag: boolean = false;
  subscription!: Subscription;
  lang: string = 'English';
  routingData: any;
  farmerNameEn: any;
  farmerNameMr: any;
  beneficieryId: any;
  farmerId: any;
  dataSource: any
  displayedColumns: string[] = ['srNo', 'postImages', 'postData', 'likes', 'action'];
  currentPage: number = 0;
  totalCount: any;
  constructor(
    public webStorage: WebStorageService,
    public common: CommonMethodsService,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorHandlingService,
    private activatedRoute: ActivatedRoute,
    public encryptdecrypt: AesencryptDecryptService,
    public dialog: MatDialog
  ) { }
  
  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.routingData = params['id'];
    })
    let spliteUrl = this.encryptdecrypt.decrypt(`${decodeURIComponent(this.routingData)}`).split('.');
    this.beneficieryId = spliteUrl[0];
    this.farmerNameEn = spliteUrl[1];
    this.farmerNameMr = spliteUrl[2];
    this.farmerId = spliteUrl[3];
    this.getTableData();
  }

  getTableData() {
    this.spinner.show();
    let str = `&PageNo=${this.pageNumber}&PageSize=10`;
    this.apiService.setHttp('GET', 'sericulture/api/Beneficiery/GetBeneficieryTimeline?FarmerId=' + 1 + (str) + '&lan=' + this.lang, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData.responseData1;
          this.dataSource = new MatTableDataSource(this.tableDataArray);
          this.totalPages = res.responseData.responseData2.totalPages;
          this.tableDatasize = res.responseData.responseData2.totalCount;
        } else {
          this.common.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : '';
          this.spinner.hide();
          this.tableDataArray = [];
          this.tableDatasize = 0;
        }
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorService.handelError(err.status);
      },
    });
  }

  deleteDialogOpen(delObj?: any) {
    let dialogObj = {
      title: this.lang == 'en' ? 'Do You Want To Delete Selected Beneficiary Timeline ?' : 'तुम्हाला निवडलेल्या लाभार्थीची टाइमलाइन हटवायची आहे का ?',
      header: this.lang == 'en' ? 'Delete Beneficiary Timeline' : 'लाभार्थी टाइमलाइन हटवा',
      okButton: this.lang == 'en' ? 'Delete' : 'हटवा',
      cancelButton: this.lang == 'en' ? 'Cancel' : 'रद्द करा',
      headerImage: 'assets/images/delete.svg'
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '30%',
      data: dialogObj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        this.apiService.setHttp('delete', 'sericulture/api/Beneficiery/DeleteTimeline?Id=' + (delObj?.id) + '&lan=' + this.lang, false, false, false, 'masterUrl');
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode == '200') {
              this.common.snackBar(res.statusMessage, 0);
              this.getTableData();
            } else {
              this.common.snackBar(res.statusMessage, 1);
            }
          },
          error: (error: any) => {
            this.errorService.handelError(error.statusCode);
          },
        });
      }
      this.highLightRowFlag = false;
    });
  }

  pageChanged(event: any) {
    this.currentPage = event.pageIndex;
    this.getTableData();
  }

  openDetailsDialog(obj: any) {
    let dialogObj = {
      multipleImage: true,
      Obj: obj,
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '80%',
      height: '80%',
      data: dialogObj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        this.getTableData();
      }
      this.highLightRowFlag = false;
    });
  }
}
