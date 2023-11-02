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

    this.setDefaultCollapse();
  }

  mouseOver(flag: boolean) {
    const div: any = document.getElementsByClassName('show')[0];
    flag ? div?.classList.remove('d-none') : div?.classList.add('d-none');
  }

  setDefaultCollapse() {
    this.pageListArray.map((ele: any) => {
      ele.collapseFlag = false;
      ele.activeFlag = false;
      if (ele.data.length > 1 && ele.subMenu) {// submenu
        ele.data.find((item: any) => {
          item.collapseFlag = false;
          item.activeFlag = false;
        })
      }
    })
  }

  onCloseSidebar() {
    this.webStorage.setSidebarState(!this.webStorage.getSidebarState());
  }
  prevClosedDep(i: any, j?: any) {
    this.setDefaultCollapse();
    if (j || j == 0) {
      this.pageListArray[i].collapseFlag = true;
      this.pageListArray[i].activeFlag = true;
      this.pageListArray[i].data[j].collapseFlag = true;
      this.pageListArray[i].data[j].activeFlag = true;
    } else {
      this.pageListArray[i].collapseFlag = true;
      this.pageListArray[i].activeFlag = true;
    }
  }

}
