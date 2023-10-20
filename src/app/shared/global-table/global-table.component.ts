import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ApiService } from 'src/app/core/services/api.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-global-table',
  templateUrl: './global-table.component.html',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,MatSlideToggleModule,FormsModule,ReactiveFormsModule, MatButtonModule, MatIconModule,MatTooltipModule,MatCheckboxModule,TranslateModule],
  styleUrls: ['./global-table.component.scss']
})
export class GlobalTableComponent {
 @Output() recObjToChild = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = new Array();
  tableRecords: any;
  tableSize!: number;
  pageNumber!: number;
  pageIndex!: number;
  tableInfo: any;
  highlightedRow: any;
  subscription!: Subscription;//used  for lang conv
  lang: any;//used for lang
  tableHeaders = new Array();
  pageName:any;
  constructor(private apiservice:ApiService,private WebStorageService: WebStorageService,){}

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })

    this.tableInfo = [];
    this.apiservice.tableData.subscribe((res:any)=>{
    this.tableInfo = res;
      if (this.tableInfo) {
        this.highlightedRow = this.tableInfo.highlightedRow;
        this.displayedColumns = this.tableInfo.displayedColumns;
        this.tableSize = this.tableInfo.tableSize;
        this.tableHeaders = this.tableInfo.tableHeaders;
        this.pageNumber = this.tableInfo.pageNumber;
        this.pageName = this.tableInfo.pageName;
        this.tableInfo.tableData ? this.tableRecords = new MatTableDataSource(this.tableInfo.tableData) : this.tableRecords = [];
        this.paginator?._pageIndex != 0 && this.pageIndex != this.pageNumber ? this.paginator?.firstPage() : '';
        this.tableRecords.sort = this.sort;
      }
     })
  }


  action(obj: any, label: string, i?:any) {
    obj.index = i;
    obj.label = label;
    obj.pageNumber = (label == 'Edit')? this.pageNumber : obj.pageIndex + 1;
     this.pageIndex = obj.pageNumber;
     this.recObjToChild.emit(obj);
  }

  setPrevVal(e:any){   //  this method for toggle button where we dont get table Api call when click on cancel button
    e.source.checked = !e.source.checked
  }
 
}
