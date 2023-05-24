import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  data: any;
  url: string;

  getData() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.http.get<any>(this.url)
      .subscribe({
        next: (v) => this.data = v.data,
        error: (e) => console.error(e),
      }       
    );
  }

  constructor(private http: HttpClient) {
    this.url = '/api/device/PriorStage/position';
  }
}
