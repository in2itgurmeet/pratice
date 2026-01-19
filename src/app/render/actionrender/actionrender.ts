import { Component } from '@angular/core';
import { FeatherModule } from 'angular-feather';

@Component({
  selector: 'app-actionrender',
  imports: [FeatherModule],
  templateUrl: './actionrender.html',
  styleUrl: './actionrender.scss',
})
export class Actionrender {
  params: any;
  cellParams: any;
  static HttpClientTestingModule: any;

  cellInit(params: any) {
    this.params = params;
    this.cellParams = this.params.cellParams;
  }
}
