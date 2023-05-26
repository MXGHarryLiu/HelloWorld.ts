import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, switchMap, filter } from 'rxjs/operators';
import { interval, of, Subscription } from 'rxjs';
import { SharedService } from '../shared.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

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
  retryCount: number = 3;
  intervalTime: number = 1000; // 1 second
  showExpansionPanel: boolean = false;
  private subscription!: Subscription;

  positionX: FormControl = new FormControl();
  positionY: FormControl = new FormControl();

  constructor (private http: HttpClient, public sharedService: SharedService, 
    private dialog: MatDialog) {}

  ngOnInit(): void {
    var url = 'api/device/' + this.name;
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
        next: (v) => this.data = v,
        error: (e) => {
          this.sharedService.syncStatus = 2;
          console.error(e);
        }
      }
    );
    this.subscription = interval(this.intervalTime).pipe(
      filter(() => this.showExpansionPanel && this.sharedService.syncStatus == 1), 
      switchMap(() => this.http.get(url + '/' + this.metadata.Property).pipe(retry(this.retryCount)))
        ).subscribe({
          next: (data: any) => this.data = data, 
          error: (e) => {
            this.sharedService.syncStatus = 2;
            console.error(e);
          }
        });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  showInfo(): void {
    
  }

  updatePosition(): void {
    const url = 'api/device/' + this.name + '/position';
    const inputData = {
      X: this.positionX.value,
      Y: this.positionY.value
    };

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    
    this.http.put(url, inputData, { headers: headers }).subscribe({
      next: (d) => d, 
      error: (e) => e
    });
  }
}