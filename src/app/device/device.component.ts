import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
  @Input() name: string = 'Blank';
  url: string = '';
  data: any;
  retryCount = 3;
  showExpansionPanel: boolean = false;

  constructor (private http: HttpClient) {}

  ngOnInit() {
    this.url = 'http://localhost:1234/device/' + this.name;
    this.http.get<any>(this.url).pipe(retry(this.retryCount))
      .subscribe({
        next: (v) => {
          this.data = v;
          this.showExpansionPanel = this.data.hasOwnProperty('Property');
        },
        error: (e) => console.error(e),
      }
    );
   
  }


}