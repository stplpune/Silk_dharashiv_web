import { Component } from '@angular/core';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SideBarComponent {
  pageListArray = new Array();

  constructor(private webStorage: WebStorageService) {
    let pageListData = this.webStorage.getAllPageName();

    let pageList = new Array();

    pageListData.find((item: any) => {
      let existing: any = pageList.filter((v: any) => {
        return v.subMenu == item.subMenu;
      });
      if (existing.length) {
        let existingIndex: any = pageList.indexOf(existing[0]);
        pageList[existingIndex].pageURL = pageList[existingIndex].pageURL.concat(item.pageURL);
        pageList[existingIndex].pageName = pageList[existingIndex].pageName.concat(item.pageName);
      } else {
        if (typeof item.pageURL == 'string')
          item.pageURL = [item.pageURL];
        item.pageName = [item.pageName];
        pageList.push(item);
      }
    });

    pageList.find((ele: any) => {
      if (this.pageListArray.length) {
        let findIndex: any = this.pageListArray.findIndex((item: any) => { return ele.mainMenuId == item.id });
        findIndex != "-1" ? (this.pageListArray[findIndex].subMenu = true, this.pageListArray[findIndex]?.data?.push(ele)) : this.pageListArray.push({ id: ele.mainMenuId, data: [ele], subMenu: false, mainMenu: ele.mainMenu });
      } else {
        this.pageListArray.push({ id: ele.mainMenuId, data: [ele], subMenu: ele.pageURL.length > 1 ? true : false, mainMenu: ele.mainMenu })
      }
    });
  }

  mouseOver(_flag: boolean) {
  }

  onCloseSidebar() {
    this.webStorage.setSidebarState(!this.webStorage.getSidebarState());
  }
}
