import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SideBarComponent {
  subscription!: Subscription;//used  for lang conv
  lang: string = 'English';
  pageListArray: any;

  constructor(public webStorage: WebStorageService) {

    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : localStorage.getItem('language') ? localStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })

    this.pageListArray = this.sideBarMenu(true);
    console.log( this.pageListArray);
    this.setDefaultCollapse();
    this.bindBreadCrumb();
  }

  sideBarMenu(flag: boolean) {
    let pageListArray: any = new Array();
    let pageList = new Array();
    let pageListData = this.webStorage.getAllPageName();
    let pageUrls: any;

    if (flag) {
      pageUrls = pageListData.filter((ele: any) => {
        if (ele.isSideBarMenu) {
          return ele;
        }
      });
    } else {
      pageUrls = pageListData;
    }

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
        item.pageURL = [item.pageURL];
        item.pageName = [item.pageName];
        item.m_PageName = [item.m_PageName];
        pageList.push(item);
      }
    });

    pageList.find((ele: any) => {
      if (pageListArray.length) {
        let findIndex: any = pageListArray.findIndex((item: any) => { return ele.mainMenuId == item.id });
        findIndex != "-1" ? (pageListArray[findIndex].subMenu = true, pageListArray[findIndex]?.data?.push(ele)) : pageListArray.push({ id: ele.mainMenuId, data: [ele], subMenu: false, mainMenu: ele.mainMenu, m_MainMenu: ele.m_MainMenu, menuIcon: ele.menuIcon });
      } else {
        pageListArray.push({ id: ele.mainMenuId, data: [ele], subMenu: ele.pageURL.length > 1 ? true : false, mainMenu: ele.mainMenu, m_MainMenu: ele.m_MainMenu, menuIcon: ele.menuIcon })
      }
    });
    return pageListArray;
  }

  bindBreadCrumb() {
    let pageListData = this.sideBarMenu(false);
    let breadCrumbArray: any = [];

    pageListData.find((ele: any) => {
      if (!ele.subMenu && ele.data[0]?.pageURL.length <= 1) {
        let obj: any = { breadCrumb: ele.data[0]?.pageName[0], m_breadCrumb: ele.data[0]?.m_PageName[0], url: ele.data[0]?.pageURL[0] };
        breadCrumbArray.push(obj);
      } else if (!ele.subMenu && ele.data[0]?.pageURL.length > 1) {
        ele.data[0]?.pageName.find((item: any, k: any) => {
          let obj: any = { breadCrumb: ele.mainMenu + '/' + item, m_breadCrumb: ele.m_MainMenu +  '/' + ele.data[0]?.m_PageName[k], url: ele.data[0]?.pageURL[k] };
          breadCrumbArray.push(obj);
        })
      } else if (ele.subMenu) {
        ele?.data.find((ob: any) => {
          ob?.pageName.find((item: any, k: any) => {
            let str = !ob.pageURL ? '' : ob.pageURL[k];
            let obj = { breadCrumb: ele?.mainMenu + '/' + ob?.subMenu + '/' + item, m_breadCrumb: ele?.m_MainMenu + '/' + ob?.m_SubMenu + '/' + ob.m_PageName[k], url: str };
            breadCrumbArray.push(obj);
          })
        })
      }
    });
    this.webStorage.breadCrumbArray.next(breadCrumbArray);
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
