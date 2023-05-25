import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeviceComponent } from './device/device.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = "Microscopy Hardware Control"
  url: string = 'http://localhost:1234/manager/device';
  response: any;
  devices: string[] = [];
  
  @ViewChild('appDevice', {read: ViewContainerRef}) appDevice!: ViewContainerRef;

  constructor (private http: HttpClient) {}

  getDevice() {
    this.devices = [];
    this.appDevice.clear();

    this.http.get<any>(this.url)
      .subscribe({
        next: (v) => {
          this.response = v; 
          this.devices = v.deviceName;
          this.loadCard()},
        error: (e) => console.error(e),
      }
    );
  }

  loadCard() {
    var i: number;
    var componentRef;
    for (i = 0; i < this.devices.length; i++) {
      componentRef = this.appDevice.createComponent<DeviceComponent>(DeviceComponent);
      componentRef.instance.name = this.devices[i];
    }
  }
}