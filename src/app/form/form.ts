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
    InputComponent,
    SingleSelectComponent,
    RadioButtonComponent,
    CheckboxButtonComponent,
    AutoCompleteMultiSelectComponent,
    CustomDatePickerComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class FormPractice implements OnInit, OnDestroy {
  schedulerDetailsForm!: FormGroup;
  notifyChecked = false;
  captureEndDate = true;
  private destroy$ = new Subject<void>();
  readonly referencePointOptions: SelectOption[] = [
    { id: 1, name: 'Previous Snapshot' },
    { id: 2, name: 'Current Snapshot' },
  ];
  readonly operationList: SelectOption[] = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
  ];
  readonly targetOptions: SelectOption[] = [
    { id: 1, name: 'Edge Device' },
    { id: 2, name: 'Device Group' },
  ];

  readonly deviceGroupOptions: SelectOption[] = [
    { id: 1, name: 'Device Group 1' },
    { id: 2, name: 'Device Group 2' },
  ];

  readonly frequencyTypeOptions: SelectOption[] = [
    { id: 1, name: 'Minutes' },
    { id: 2, name: 'Hours' },
    { id: 3, name: 'Days' },
  ];

  readonly emailOptions: SelectOption[] = [
    { id: 1, name: 'Email 1' },
    { id: 2, name: 'Email 2' },
  ];

  readonly scheduleByOptions: SelectOption[] = [
    { id: 1, name: 'Gurmeeet@gmai.com' },
  ];

  readonly taskOptions: SelectOption[] = [
    { id: '101', name: 'Notify Me' },
    { id: '102', name: 'Notify other' },
  ];

  readonly optionsRadio: SelectOption[] = [
    { id: 1, name: 'Specify End Date' },
    { id: 2, name: 'Never' },
  ];
  readonly singleConfig: SingleSelectConfig = {
    idField: 'id',
    textField: 'name',
    disabledField: 'disable',
    placeholder: 'Select Option',
  };

  readonly radioConfig: RadioButtonConfig = {
    valueField: 'id',
    textField: 'name',
    name: 'Specify End Date',
    layout: 'horizontal',
  };

  readonly checkBoxConfig: CheckBoxConfig = {
    idField: 'id',
    textField: 'name',
    name: 'check23',
    disabledField: 'disable',
  };

  readonly autoMultiSelectConfig: AutoCompleteMultiSelectConfig = {
    idField: 'id',
    textField: 'name',
    disabledField: 'disable',
    placeholder: 'Type to Search',
    selectAll: false,
    chipLimit: 2,
    customInput: false,
  };

  readonly inputConfig: InputConfig = {
    type: 'text',
    placeholder: 'Enter value',
  };

  readonly baseInputConfig: any = {
    type: 'time',
    placeholder: 'Enter value',
  };

  ngOnInit(): void {
    this.initializeSchedulerDetailsForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSchedulerDetailsForm(): void {
    this.schedulerDetailsForm = new FormGroup({
      operation: new FormControl('', Validators.required),
      scheduleBy: new FormControl(
        { value: { id: '1', name: 'Notify Me' }, disabled: true },
        Validators.required
      ),
      target: new FormControl('', Validators.required),
      deviceGroup: new FormControl('', Validators.required),
      scheduleName: new FormControl('', Validators.required),
      captureStartDate: new FormControl('', Validators.required),
      startTime: new FormControl('', Validators.required),
      startTimeValue: new FormControl('', Validators.required),
      captureEndDate: new FormControl('', Validators.required),
      endTime: new FormControl('', Validators.required),
      endTimeValue: new FormControl('', Validators.required),
      captureEndDateRadio: new FormControl('1', Validators.required),
      frequency: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
      frequencyType: new FormControl('', Validators.required),
      referencePoint: new FormControl(
        { value: { id: 1, name: 'Previous Snapshot' }, disabled: true },
        Validators.required
      ),
      emailAddresses: new FormControl([], Validators.required),
    });
  }

  onRadio(event: SelectOption): void {
    const isNever = event.name === 'Never';
    this.captureEndDate = !isNever;
    const endDateControls = ['captureEndDate', 'endTime', 'endTimeValue'];
    if (isNever) {
      endDateControls.forEach(control => {
        this.schedulerDetailsForm.get(control)?.clearValidators();
      });
      this.schedulerDetailsForm.patchValue({
        captureEndDate: '',
        endTime: '',
        endTimeValue: '',
        captureEndDateRadio: event,
      });
    } else {
      endDateControls.forEach(control => {
        this.schedulerDetailsForm.get(control)?.setValidators(Validators.required);
      });
    }
    endDateControls.forEach(control => {
      this.schedulerDetailsForm.get(control)?.updateValueAndValidity();
    });
  }

  checkBox(data: SelectOption[]): void {
    this.notifyChecked = data.some(
      item => item.id === '102' && (item as any).checked
    );
  }

  goNext(): void {
    if (this.schedulerDetailsForm.invalid) {
      return;
    }

    const payload = this.schedulerDetailsForm.getRawValue();
    console.log('FINAL PAYLOAD:', payload);
  }

  clearForm(): void {
    this.schedulerDetailsForm.reset();
    this.initializeSchedulerDetailsForm();
    this.checkBox(this.taskOptions);
    this.captureEndDate = true;
  }

  displayDataStart(event: any): void {
    console.log('captureStartDate event:', event);
  }

  displayDataEnd(event: any): void {
    console.log('captureEndDate event:', event);
  }
}
