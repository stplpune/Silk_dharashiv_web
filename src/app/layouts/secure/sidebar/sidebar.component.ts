import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SideBarComponent {
  pageListArray = new Array();
  subscription!: Subscription;//used  for lang conv
  lang: string = 'English';
  constructor(public webStorage: WebStorageService) {

    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })


    let pageListData = this.webStorage.getAllPageName();

    let pageUrls = pageListData.filter((ele: any) => {
      if (ele.isSideBarMenu) {
        return ele;
      }
    });

    let pageList = new Array();

    pageUrls.find((item: any) => {
      let existing: any = pageList.filter((v: any) => {
        return v.subMenu == item.subMenu;
      });
      if (existing.length) {
        let existingIndex: any = pageList.indexOf(existing[0]);
        pageList[existingIndex].pageURL = pageList[existingIndex].pageURL.concat(item.pageURL);
        pageList[existingIndex].pageName = pageList[existingIndex].pageName.concat(item.pageName);
        pageList[existingIndex].m_PageName = pageList[existingIndex].m_PageName.concat(item.m_PageName);
      } else {
        if (typeof item.pageURL == 'string')
          item.pageURL = [item.pageURL];
        item.pageName = [item.pageName];
        item.m_PageName = [item.m_PageName];
        pageList.push(item);
      }
    });

    pageList.find((ele: any) => {

      if (this.pageListArray.length) {
        let findIndex: any = this.pageListArray.findIndex((item: any) => { return ele.mainMenuId == item.id });
        findIndex != "-1" ? (this.pageListArray[findIndex].subMenu = true, this.pageListArray[findIndex]?.data?.push(ele)) : this.pageListArray.push({ id: ele.mainMenuId, data: [ele], subMenu: false, mainMenu: ele.mainMenu, m_MainMenu: ele.m_MainMenu,menuIcon:ele.menuIcon });
      } else {
        this.pageListArray.push({ id: ele.mainMenuId, data: [ele], subMenu: ele.pageURL.length > 1 ? true : false, mainMenu: ele.mainMenu, m_MainMenu: ele.m_MainMenu,menuIcon:ele.menuIcon})
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
    });
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
