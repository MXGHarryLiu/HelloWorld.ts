import { Component, Input, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, switchMap, filter } from 'rxjs/operators';
import { interval, of, Subscription } from 'rxjs';
import { SharedService } from '../shared.service';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule} from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  positionX!: number;
  positionY!: number;

  constructor (private http: HttpClient, 
    public sharedService: SharedService, 
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {}

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
    this.dialog.open(InfoDialog, {data: this.metadata});
  }

  updatePosition(): void {
    const url = 'api/device/' + this.name + '/position';
    const inputData = {
      X: this.positionX,
      Y: this.positionY
    };

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    
    this.http.put(url, inputData, { headers: headers }).subscribe({
      next: (d) => d, 
      error: (e) => {
        this.warning('Unable to set parameter due to lost connection. ');
        console.error(e);
      }
    });
  }

  warning(msg: string): void {
    this.snackBar.open(msg, 'Ok', {
      duration: 5000
    });
  }
}

@Component({
  selector: 'info-dialog',
  templateUrl: './info.dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class InfoDialog {

  constructor (@Inject(MAT_DIALOG_DATA) public metadata: any) {}

  getParameterString(): string {
    var s: string = '';
    for (const parameter in this.metadata.Parameter){
      s = s + parameter + ': ' + this.metadata.Parameter[parameter] + '<br>';
    }
    return s;
  }
  
}