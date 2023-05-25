import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
  isSyncing: boolean = false;

  constructor() { }
}
