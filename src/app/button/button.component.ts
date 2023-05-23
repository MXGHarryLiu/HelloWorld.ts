import { Component } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  showHello: boolean = false;

  showBanner() {
    this.showHello = true;
  }

	constructor() {}
}
