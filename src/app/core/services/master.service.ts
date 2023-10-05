import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private apiService:ApiService ) { }

    GetAllSchemeType(){
    return new Observable((obj)=>{
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/GetAllSchemeType', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next:(res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetDepartmentDropdown(){
    return new Observable((obj)=>{
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-DepartmentDropdown', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next:(res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetDeptLevelDropDown(){
    return new Observable((obj)=>{
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-DeptLevelDropDown', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next:(res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetDeptLevelbyDeptId(deptId:number){
    return new Observable((obj)=>{
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-DeptLevelbyDeptId='+deptId, false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next:(res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  GetActionDropDown(){
    return new Observable((obj)=>{
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-ActionDropDown', false, false, false, 'masterUrl')
      this.apiService.getHttp().subscribe({
        next:(res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }


}

