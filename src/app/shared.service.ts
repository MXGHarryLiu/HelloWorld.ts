import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
  syncStatus: number = 0;  // 0: off, 1, on, 2: error

  constructor() { }
}
