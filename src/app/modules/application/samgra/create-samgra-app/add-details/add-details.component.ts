import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterService } from 'src/app/core/services/master.service';

@Component({
  selector: 'app-add-details',
  templateUrl: './add-details.component.html',
  styleUrls: ['./add-details.component.scss']
})
export class AddDetailsComponent {

  cropDetailsForm !: FormGroup;
  farmsGoodArray = new Array();
  constructor( 
    private fb :FormBuilder,
    private masterService : MasterService,
  ) {}

  ngOnInit() {
    this.cropDetailsFormData();
    this.getAllfarmsGood();
   }

  cropDetailsFormData() {
    this.cropDetailsForm = this.fb.group({
      "id": [0],
      "applicationId": [0],
      "cropId": [0],
      "area": [0],
      "totalProduction": [0],
      "averageRate": [0],
      "totalProductionAmt": [0],
      "totalExpenses": [0],
      "netIncome": [0],
      "acreNetIncome": [0],
      "createdBy": [0],
      "createdDate": new Date(),
      "modifiedBy": [0],
      "modifiedDate": new Date(),
      "isDeleted": true,
      "flag": "string"
    })
  }


  getAllfarmsGood(){
    this.farmsGoodArray = [];
    this.masterService.getFarmGoods().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.farmsGoodArray = res.responseData;          
        }
        else {
          this.farmsGoodArray = [];
        }
      })
    })
  }  




}
