import { Component } from '@angular/core';
import { SingleSelectComponent } from 'cats-ui-lib';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-single-slect',
  imports: [SingleSelectComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './single-slect.html',
  styleUrl: './single-slect.scss',
})
export class SingleSlect {
  signleSelectvalue = new FormControl('');
  api: any;
  data: any;
  value: any;
  cellParams: any;
  placeholder: string = 'Select Status';
  configue: any = {
    idField: 'id',
    textField: 'name',
  };
  optionList: any[] = [];

  cellInit(params: any) {
    this.optionList = params.cellParams.optionList;
    this.data = params?.data;
    this.value = params?.value;
    if (params.data.isInEdit) {
      this.signleSelectvalue.patchValue(params.data.status);
    }
  }
}
