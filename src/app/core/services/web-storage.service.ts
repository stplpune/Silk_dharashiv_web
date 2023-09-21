import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebStorageService {
  toggled: boolean = false;

  constructor() { }


  getSidebarState() {
    return this.toggled;
  }

  setSidebarState(state: boolean) {
    this.toggled = state;
  }
}
