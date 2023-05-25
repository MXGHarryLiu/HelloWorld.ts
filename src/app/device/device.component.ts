import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
  @Input() name: string = 'Blank';
  url: string = '';
  metadata: any;
  data: any;
  retryCount = 3;
  showExpansionPanel: boolean = false;

  constructor (private http: HttpClient) {}

  ngOnInit() {
    var url = 'http://localhost:1234/device/' + this.name;
    this.http.get<any>(url).pipe(retry(this.retryCount),
      switchMap((metadata: any) => {
        this.metadata = metadata;
        this.showExpansionPanel = this.metadata.hasOwnProperty('Property');
        if (this.showExpansionPanel) {
          const property = metadata.Property;
          const url2 = url + '/' + property;
          return this.http.get(url2).pipe(retry(this.retryCount));
        } else {
          return of(null);
        }
      })
      ).subscribe({
        next: (v) => {
          this.data = v;
        },
        error: (e) => console.error(e),
      }
    );
  }

  updatePosition() {

  }
}