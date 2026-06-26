import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  AutoCompleteMultiSelectComponent,
  AutoCompleteMultiSelectConfig,
  CheckboxButtonComponent,
  CheckBoxConfig,
  CustomDatePickerComponent,
  InputComponent,
  InputConfig,
  RadioButtonComponent,
  RadioButtonConfig,
  SingleSelectComponent,
  SingleSelectConfig,
} from 'cats-ui-lib';
import { Subject } from 'rxjs';



interface SelectOption {
  id: number | string;
  name: string;
  disable?: boolean;
}

@Component({
  selector: 'app-form',
  imports: [
    // InputComponent,
    // SingleSelectComponent,
    // RadioButtonComponent,
    // CheckboxButtonComponent,
    // AutoCompleteMultiSelectComponent,
    // CustomDatePickerComponent,
    // ReactiveFormsModule,
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class FormPractice {
}