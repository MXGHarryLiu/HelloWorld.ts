import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry, switchMap, filter } from 'rxjs/operators';
import { interval, of, Subscription } from 'rxjs';
import { SharedService } from '../shared.service';

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

  constructor (private http: HttpClient, public sharedService: SharedService) {}

  ngOnInit(): void {
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
    this.subscription = interval(this.intervalTime).pipe(
      filter(() => this.showExpansionPanel && this.sharedService.isSyncing), 
      switchMap(() => this.http.get(url + '/' + this.metadata.Property).pipe(retry(this.retryCount)))
        ).subscribe((data: any) => {
        this.data = data;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updatePosition() {

  }
}