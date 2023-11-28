import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CommonMethodsService } from './common-methods.service';
import { Router } from '@angular/router';
import { WebStorageService } from './web-storage.service';
import { AesencryptDecryptService } from './aesencrypt-decrypt.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private apiService: ApiService, private commonMethodsService: CommonMethodsService, private router: Router,
    private webstorageService: WebStorageService, private AESEncryptDecryptService: AesencryptDecryptService) { }

  GetAllSchemeType() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/GetAllSchemeType', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetDepartmentDropdown(SchemeId?: any) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-DepartmentDropdown?SchemeId=' + (SchemeId || 0), false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetDeptLevelDropDown() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-DeptLevelDropDown', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetDeptLevelbyDeptId(deptId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-DeptLevelbyDeptId?DeptId=' + deptId, false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetActionDropDown() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-ActionDropDown', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  getOrderLevel(lan: any) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-MasterLevelApproval?lan=' + lan, false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetDesignationDropDown(deptId: number, desingLevelId?: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-DesignationDropDown?DepartmentId=' + deptId + '&DepartmentLevelId=' + desingLevelId, false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetDesignationDropDownOnDeptLevel(deptId: number, deptLevelId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-DesignationDropDown?DepartmentId=' + deptId + '&DepartmentLevelId=' + deptLevelId, false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetAllState() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-AllState', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }


  GetAllDistrict(stateId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-AllDistrict?StateId=' + stateId, false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetAllBlock(stateId: number, distId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-AllBlock?StateId=' + stateId + '&DistId=' + distId, false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetAllTaluka(stateId: number, distId: number, blockId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-AllTaluka?StateId=' + stateId + '&DistId=' + distId + '&BlockId=' + blockId, false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetAllCircle(stateId: number, distId: number, talukaId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-AllCircle?StateId=' + stateId + '&DistId=' + distId + '&TalukaId=' + talukaId, false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetAllVillages(stateId: number, distId: number, talukaId: number, circleId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-AllVillages?StateId=' + stateId + '&DistId=' + distId + '&TalukaId=' + talukaId + '&CircleId=' + circleId, false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetLevelApproval() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-MasterLevelApproval', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetModule() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-MainMenu', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetSubModule(moduleId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-SubMenu?MenuId=' + moduleId, false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetFarmGoods() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-FarmGoods', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetMarketCommittee() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-MarketCommittee', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }


  GetUnit() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-Unit', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetGrampanchayat(talukaId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-Grampanchayat?TalukaId=' + talukaId, false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetGrainageType() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-Grainage-Type', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetFarmType() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-Farm-Type', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetIrrigationFacility() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-Irrigation-Facility', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetCandidateRelation() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/Get-Candidate-Relation', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetBank() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/Get-Bank', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetQualification() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/Get-Qualification', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetCategoryOfBeneficiary() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/Get-Category-Of-Beneficiary', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetApprovalStatus() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/GetApprovalStatus', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  getServerDateTime() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'sericulture/api/Login/Get-Current-Date-Time', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  

  refreshTokenJWT(obj: any) {
    this.apiService.setHttp('POST', 'sericulture/api/Login/refresh-token', false, obj, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          let loginObj: any = this.webstorageService.getLocalstorageData();
          loginObj.responseData1 = res.responseData;
          let loginData = this.AESEncryptDecryptService.encrypt(JSON.stringify(loginObj));
          localStorage.setItem('silkDharashivUserInfo', loginData);
        } else {
          localStorage.removeItem('silkDharashivUserInfo');
          this.router.navigate(['/login']);
          this.commonMethodsService.snackBar('Your Session Has Expired. Please Re-Login Again.', 1);
        }
      },
      error: () => {
        localStorage.removeItem('silkDharashivUserInfo');
        this.router.navigate(['/login']);
        this.commonMethodsService.snackBar('Your Session Has Expired. Please Re Login Again.', 1);
      }
    });
  }
}

