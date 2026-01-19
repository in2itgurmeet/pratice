import { Component } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-input-cell-renderer',
  imports: [],
  templateUrl: './input-cell-renderer.html',
  styleUrl: './input-cell-renderer.scss',
})
export class InputCellRenderer {
  data: any;
  value: any;
  cellParams: any;
  api: any;

  private inputChangeSubject = new Subject<any>();

  constructor() {
    this.inputChangeSubject.pipe(debounceTime(300)).subscribe((newValue: any) => {
      if (this.cellParams?.onValueChange) this.cellParams.onValueChange(newValue);
    });
  }

  cellInit(params: any) {
    this.data = params?.data;
    this.value = params?.value;
    this.cellParams = params?.cellParams || {};
  }

  onChange(event: any) {
    this.value = event.target?.value;
    this.inputChangeSubject.next(event.target?.value);
  }
}
