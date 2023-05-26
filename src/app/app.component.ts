import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeviceComponent } from './device/device.component';
import { SharedService } from './shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = "Microscopy Hardware Control"
  url: string = 'api/manager/device';
  response: any;
  devices: string[] = [];
  
  @ViewChild('appDevice', {read: ViewContainerRef}) appDevice!: ViewContainerRef;

  constructor (private http: HttpClient, 
    public sharedService: SharedService, 
    private snackBar: MatSnackBar) {}

  getDevice(): void {
    this.devices = [];
    this.appDevice.clear();

    this.http.get<any>(this.url)
      .subscribe({
        next: (v) => {
          this.response = v; 
          this.devices = v.deviceName;
          this.loadCard()},
        error: (e) => {
          this.warning('Unable to connect to microscope server. ');
          console.error(e);
        }
      }
    );
  }

  loadCard(): void {
    var i: number;
    var componentRef;
    for (i = 0; i < this.devices.length; i++) {
      componentRef = this.appDevice.createComponent<DeviceComponent>(DeviceComponent);
      componentRef.instance.name = this.devices[i];
    }
  }

  toggleSyncing(): void {
    if (this.sharedService.syncStatus == 1){
      this.sharedService.syncStatus = 0;
    } else {
      this.sharedService.syncStatus = 1;
    }
  }

  warning(msg: string): void {
    this.snackBar.open(msg, 'Ok', {
      duration: 5000
    });
  }
}