import { Injectable } from '@angular/core';
import { CommonMethodsService } from './common-methods.service';
import { ApiService } from './api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from './error-handling.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  constructor(private commonService:CommonMethodsService,
    private apiService:ApiService,
    private spinner:NgxSpinnerService,
    private errorService:ErrorHandlingService,
    private commonMethodService : CommonMethodsService) { }

  uploadDocuments(event?: any, folderName?: any, allowedDocTypes?: any, _minsize?: any, _maxsize?: any, lflag?:any) {
        return new Observable(obj => {
      const selResult = event.target.value.split('.');
      const docExt = selResult.pop();
      docExt.toLowerCase();
      if (allowedDocTypes.match(docExt)) {
        if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
          if (file.size > 1048576) {
            obj.error("Required file size should be less than " + 1 + " MB.");
            this.commonMethodService.snackBar(lflag == 'en' ? "Required file size should be less than "+ 1 + " MB." : "आवश्यक फाइल आकार "+ 1 + " MB"+" पेक्षा कमी असावा", 1)
          }
          else {
            const reader: any = new FileReader();
            reader.onload = () => {
              const formData = new FormData();
              formData.append('FolderName', folderName);
              formData.append('DocumentType', docExt);
              formData.append('UploadDocPath', file);
              this.apiService.setHttp('POST', 'sericulture/api/Document/UplodFile?lan='+lflag, false, formData, false, 'masterUrl');
              this.apiService.getHttp().subscribe({
                next: (res: any) => {                  
                  this.spinner.hide();
                  if (res.statusCode == "200") {
                    obj.next(res);
                  }
                  else {
                    this.commonService.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
                  }
                },
                error: ((error: any) => {
                  this.errorService.handelError(error.status);
                })
              })
            }
            reader.readAsDataURL(event.target.files[0]);
          }
        }
      }
      else {
        obj.next('error');
        obj.error("Only " + allowedDocTypes + " file format allowed.");   
        this.commonMethodService.snackBar(lflag == 'en' ? "Only " + allowedDocTypes + " file format allowed." : "फक्त " + allowedDocTypes + " फाइल फॉरमॅटला परवानगी आहे.", 1)
        // this.commonService.snackBar('Only Supported file Types... jpg, png, jpeg', 1)
      }
    })
  }
  
}
