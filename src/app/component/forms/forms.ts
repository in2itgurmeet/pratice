import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import {
  CheckBoxConfig,
  CustomDatePickerComponent,
  InputConfig,
  MultiSelectConfig,
  RadioButtonConfig,
  SingleSelectConfig,
} from "cats-ui-lib";
import { catchError, forkJoin, map, of, Subject, switchMap, takeUntil, timer } from "rxjs";
interface SelectOption {
  id: number | string;
  name: string;
  disable?: boolean;
}
import { CheckboxButtonComponent, InputComponent, MultiSelectComponent, RadioButtonComponent, SingleSelectComponent } from 'cats-ui-lib';
import { Apiservice } from "../../service/apiservice";
import { FeatherModule } from "angular-feather";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-forms',
  imports: [InputComponent, SingleSelectComponent, MultiSelectComponent, ReactiveFormsModule, RadioButtonComponent, CommonModule, CheckboxButtonComponent, CustomDatePickerComponent, FeatherModule],
  templateUrl: './forms.html',
  styleUrl: './forms.scss',
})
export class Forms {
  operationControl = new FormControl('', Validators.required);
  schedulerDetailsForm!: FormGroup;
  operationalTemplateForm!: FormGroup;
  complianceTemplateForm!: FormGroup;
  configurationalTemplateForm!: FormGroup;
  isDeviceGroupSelected = false;
  notifyChecked = false;
  selectedRadio: any;
  captureEndDate = true;
  schedulerData: any;
  @Input() isInEditMode: boolean = false;
  targetOptions: SelectOption[] = [];
  frequencyTypeOptions: any[] = [];
  operationListOptions: SelectOption[] = [];
  emailOptionsList: SelectOption[] = [];
  deviceGroupOptions: any[] = [];
  scheduleByOptions: any[] = [];
  private destroy$ = new Subject<void>();
  private formDestroy$ = new Subject<void>();

  readonly referencePointOptions: SelectOption[] = [
    { id: 1, name: 'Previous Snapshot' },
    { id: 2, name: 'Current Snapshot' },
  ];
  inputConfig: InputConfig = {
    type: "text",
    placeholder: "Enter value",
  };
  readonly executionTypeOptions: SelectOption[] = [
    { id: 1, name: 'Scheduled' },
    { id: 2, name: 'Immediate' },
  ];

  readonly organizationOptions: SelectOption[] = [
    { id: 1, name: 'Org 1' },
    { id: 2, name: 'Org 2' },
  ];

  readonly regionOptions: SelectOption[] = [
    { id: 1, name: 'Region 1' },
    { id: 2, name: 'Region 2' },
  ];

  readonly siteOptions: SelectOption[] = [
    { id: 1, name: 'Site 1' },
    { id: 2, name: 'Site 2' },
  ];

  readonly deviceTypeOptions: SelectOption[] = [
    { id: 1, name: 'Router' },
    { id: 2, name: 'Switch' },
    { id: 3, name: 'Firewall' },
  ];

  readonly deviceOptions: SelectOption[] = [
    { id: 1, name: 'Device A' },
    { id: 2, name: 'Device B' },
  ];

  readonly templateOptions: SelectOption[] = [
    { id: 1, name: 'Template 1' },
    { id: 2, name: 'Template 2' },
  ];

  readonly compliancePolicyTypeOptions: SelectOption[] = [
    { id: 1, name: 'Policy Type 1' },
    { id: 2, name: 'Policy Type 2' },
  ];

  readonly compliancePolicyFeatureOptions: SelectOption[] = [
    { id: 1, name: 'Feature 1' },
    { id: 2, name: 'Feature 2' },
  ];

  readonly filterDeviceGroupOptions: SelectOption[] = [
    { id: 1, name: 'Group 1' },
    { id: 2, name: 'Group 2' },
  ];

  taskOptions: any[] = [
    { id: 1, name: 'Notify Me', checked: true },
    { id: 2, name: 'Notify other', checked: false },
  ];
  notiFyOnChanges: any[] = [
    { id: 1, name: 'System Notify', checked: true },
    { id: 2, name: 'Notify Me', checked: false },
    { id: 3, name: 'Notify other', checked: false },
  ];

  readonly optionsRadio: SelectOption[] = [
    { id: 1, name: 'Specify End Date' },
    { id: 2, name: 'Never' },
  ];
  readonly frequencyOptions: SelectOption[] = [
    { id: 1, name: 'Repeat' },
    { id: 2, name: 'Not Repeat' },
  ];
  readonly singleConfig: SingleSelectConfig = {
    idField: 'id',
    textField: 'name',
    disabledField: 'disable',
    placeholder: 'Select Option',
  };
  readonly targetConfig: SingleSelectConfig = {
    idField: 'id',
    textField: 'name',
    disabledField: 'disable',
    placeholder: 'Select Target',
  }
  timeInputConfig: any = {
    idField: 'id',
    textField: 'name',
    disabledField: 'disable',
    placeholder: 'Select Time',
  }
  frequencyInputConfig: any = {
    idField: 'id',
    textField: 'name',
    placeholder: 'Select Frequency',
  }
  readonly frequencyTypeConfig: SingleSelectConfig = {
    idField: 'id',
    textField: 'name',
    disabledField: 'disable',
    placeholder: 'Select Frequency Type',
  }

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

  readonly deviceMultiSelectConfig: MultiSelectConfig = {
    idField: "id",
    textField: "name",
    disabledField: "disable",
    placeholder: 'Select Device Group',
    prefixLabel: "",
    enableSearch: true,
    chipLimit: 1,
    selectAll: true,
    required: false,
  };
  emailMultiSelectConfig: MultiSelectConfig = {
    idField: 'id',
    textField: 'name',
    disabledField: 'disable',
    placeholder: 'Select Email Address',
    selectAll: false,
    chipLimit: 1,
  }

  timeZoneConfig: SingleSelectConfig = {
    idField: 'id',
    textField: 'name',
    disabledField: 'disable',
    placeholder: 'Select Time Zone',
  }
  timeZoneOtions: SelectOption[] = [
    { id: 1, name: 'IST' },
    { id: 2, name: 'UTC' },
  ];
  readonly baseInputConfig: any = {
    type: 'time',
    placeholder: 'Enter value',
  };
  constructor(
    public schedulerService: Apiservice,
  ) {

  }
  tokenValue: any

  ngOnInit(): void {
    this.scheduleByOptions = [
      { id: 1, name: 'KumarGurmeet096@gmail.com' },
    ]
    this.initializeSchedulerDetailsForm();

    this.getAllDropDownList();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.formDestroy$.next();
    this.formDestroy$.complete();
  }


  private initializeSchedulerDetailsForm(): void {
    this.operationalTemplateForm = new FormGroup({
      operation: new FormControl('', Validators.required),
      scheduleBy: new FormControl({ value: { id: 1, name: 'Device Group' }, disabled: true }, Validators.required),
      target: new FormControl('', Validators.required),
      deviceGroup: new FormControl(''),
      scheduleName: new FormControl('', Validators.required),
      captureStartDate: new FormControl('', Validators.required),
      startTime: new FormControl('', Validators.required),
      startTimeZone: new FormControl('', Validators.required),
      captureEndDate: new FormControl('', Validators.required),
      endTime: new FormControl('', Validators.required),
      endTimeZone: new FormControl('', Validators.required),
      captureEndDateRadio: new FormControl(1, Validators.required),
      frequency: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      frequencyType: new FormControl('', Validators.required),
      referencePoint: new FormControl({ value: { id: 1, name: 'Previous Snapshot' }, disabled: true }, Validators.required),
      notifyChanges: new FormControl(1, Validators.required),
      emailAddresses: new FormControl([])
    });
  }

  clearForm() {

  }
  goNext() {
    console.log(this.operationalTemplateForm.value)
  }
  onRadio(value: any) {

  }
  checkBox(event: any): void {
    this.toggleEmailAddress(event);
  }

  private toggleEmailAddress(event: any): void {
    this.notifyChecked = event?.some(
      (item: any) => item.name === 'Notify other'
    );
    const emailControl = this.operationalTemplateForm.get('emailAddresses');
    if (!emailControl) return;
    if (this.notifyChecked) {
      emailControl.setValidators([Validators.required]);
    } else {
      emailControl.clearValidators();
      emailControl.reset([]);
    }

    emailControl.updateValueAndValidity();
  }



  getAllDropDownList() {
    forkJoin([
      this.schedulerService.getTargetDropDown(),
      this.schedulerService.getFrequencyDropDwon(),
      this.schedulerService.getOperationsDropDown(),
      this.schedulerService.getEmailsList(),
      this.schedulerService.getAllGroupList()
    ]).subscribe({
      next: (res: any[]) => {
        this.targetOptions = res[0].map((item: any, _index: number) => ({
          key: item.key,
          name: item.label
        }));
        this.frequencyTypeOptions = res[1].map((item: any, _index: number) => ({
          key: item.key,
          name: item.label
        }))
        this.operationListOptions = res[2].map((item: any, _index: number) => ({
          key: item.key,
          name: item.label
        }))
        this.emailOptionsList = res[3].map((item: any, _index: number) => ({
          name: item.email
        }));
        this.deviceGroupOptions = res[4]
      },
      error: (err) => {

      }
    });
  }
}