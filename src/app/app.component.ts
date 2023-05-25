import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hello-world';
  url: string = 'http://localhost:1234/manager/device';
  response: any;
  deviceName: string = 'DeviceName';
  showDevices: boolean = false;
  devices: string[] = [];

  getDeviceTest() {
    this.showDevices = true;
  }

  getDevice() {
    this.http.get<any>(this.url)
      .subscribe({
        next: (v) => {
          this.response = v; 
          this.devices = v.deviceName;
          this.showDevices = true},
        error: (e) => console.error(e),
      }
    );
  }

  constructor (private http: HttpClient) {}


}
