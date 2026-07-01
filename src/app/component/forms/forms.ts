import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import {
  CheckBoxConfig,
  CustomDatePickerComponent,
  InputConfig,
  MultiSelectConfig,
  RadioButtonConfig,
  SingleSelectConfig,
} from "cats-ui-lib";
import { finalize, forkJoin, Subject, takeUntil } from "rxjs";
interface SelectOption {
  id: number | string;
  name: string;
  disable?: boolean;
  apiId?: number | string;
}
import { CheckboxButtonComponent, InputComponent, MultiSelectComponent, RadioButtonComponent, SingleSelectComponent } from 'cats-ui-lib';
import { Apiservice } from "../../service/apiservice";
import { FeatherModule } from "angular-feather";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-forms',
  imports: [InputComponent, SingleSelectComponent, MultiSelectComponent, ReactiveFormsModule, RadioButtonComponent, CommonModule, CheckboxButtonComponent, CustomDatePickerComponent, FeatherModule],
  templateUrl: './forms.html',
  styleUrl: './forms.scss',
})
export class Forms implements OnInit {
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
  isSubmitting = false;
  submitted = false;
  submitSuccess = '';
  submitError = '';
  lastSubmittedPayload: any;
  @Input() isInEditMode: boolean = false;
  targetOptions: SelectOption[] = [];
  frequencyTypeOptions: any[] = [];
  operationListOptions: SelectOption[] = [];
  emailOptionsList: SelectOption[] = [];
  deviceGroupOptions: any[] = [];
  scheduleByOptions: any[] = [];
  private destroy$ = new Subject<void>();
  private formDestroy$ = new Subject<void>();
  private readonly captureEndDateSpecifyValue = 'capture_specify_end_date';
  private readonly frequencyRepeatValue = 'frequency_repeat';

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
    { id: this.captureEndDateSpecifyValue, name: 'Specify End Date', apiId: 1 },
    { id: 'capture_never', name: 'Never', apiId: 2 },
  ];
  readonly frequencyOptions: SelectOption[] = [
    { id: this.frequencyRepeatValue, name: 'Repeat', apiId: 1 },
    { id: 'frequency_not_repeat', name: 'Not Repeat', apiId: 2 },
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
    type: 'number',
    placeholder: 'Enter Frequency',
  }
  readonly frequencyTypeConfig: SingleSelectConfig = {
    idField: 'id',
    textField: 'name',
    disabledField: 'disable',
    placeholder: 'Select Frequency Type',
  }

  readonly captureEndDateRadioConfig: RadioButtonConfig = {
    valueField: 'id',
    textField: 'name',
    name: 'captureEndDateRadio',
    layout: 'horizontal',
  };

  readonly frequencyRadioConfig: RadioButtonConfig = {
    valueField: 'id',
    textField: 'name',
    name: 'frequencyMode',
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
    // console.log('ngOnInit');
    this.scheduleByOptions = [
      { id: 1, name: 'kumargumeet096@gmail.com' },
    ]
    this.initializeSchedulerDetailsForm();
    this.watchFormChanges();
    // this.operationalTemplateForm
    //   .get('operation')
    //   ?.valueChanges
    //   .subscribe(() => {
    //     this.resetOperationSpecificValues();
    //     this.applyOperationValidators();
    //   });
    this.getAllDropDownList();
  }
  ngOnDestroy(): void {
    // console.log('ngOnDestroy');
    this.destroy$.next();
    this.destroy$.complete();
    this.formDestroy$.next();
    this.formDestroy$.complete();
  }


  private initializeSchedulerDetailsForm(): void {
    this.operationalTemplateForm = new FormGroup({
      operation: new FormControl('', Validators.required),
      scheduleBy: new FormControl({ value: this.scheduleByOptions[0], disabled: true }),
      target: new FormControl(''),
      deviceGroup: new FormControl(''),
      scheduleName: new FormControl(''),
      captureStartDate: new FormControl(''),
      startTime: new FormControl(''),
      startTimeZone: new FormControl(''),
      captureEndDate: new FormControl(''),
      endTime: new FormControl(''),
      endTimeZone: new FormControl(''),
      captureEndDateRadio: new FormControl(this.captureEndDateSpecifyValue, Validators.required),
      frequencyMode: new FormControl(this.frequencyRepeatValue),
      frequency: new FormControl(''),
      frequencyType: new FormControl(''),
      referencePoint: new FormControl({ value: { id: 1, name: 'Previous Snapshot' }, disabled: true }),
      notifyChanges: new FormControl(),
      notifyCompletion: new FormControl(),
      emailAddresses: new FormControl([]),
      executionType: new FormControl(''),
      organization: new FormControl(''),
      region: new FormControl(''),
      site: new FormControl(''),
      filterDeviceGroup: new FormControl([]),
      deviceType: new FormControl(''),
      device: new FormControl(''),
      templateTarget: new FormControl(''),
      compliancePolicyType: new FormControl(''),
      compliancePolicyFeature: new FormControl(''),
      complianceNotifyChanges: new FormControl(),
    });
    this.applyOperationValidators();
  }

  clearForm(): void {
    this.submitted = false;
    this.submitSuccess = '';
    this.submitError = '';
    this.notifyChecked = false;
    this.captureEndDate = true;
    console.log('forms-rest')
    this.operationalTemplateForm.reset({
      scheduleBy: { id: 'device_group', name: 'Device Group' },
      captureEndDateRadio: this.captureEndDateSpecifyValue,
      frequencyMode: this.frequencyRepeatValue,
      referencePoint: { id: 1, name: 'Previous Snapshot' },
      notifyChanges: 1,
      notifyCompletion: 1,
      emailAddresses: [],
      filterDeviceGroup: [],
      complianceNotifyChanges: 1,
    });
    this.operationalTemplateForm.get('scheduleBy')?.disable({ emitEvent: false });
    this.operationalTemplateForm.get('referencePoint')?.disable({ emitEvent: false });
    this.applyOperationValidators();
  }

  goNext(): void {
    this.submitted = true;
    this.submitSuccess = '';
    this.submitError = '';
    this.applyOperationValidators();

    if (this.operationalTemplateForm.invalid) {
      this.operationalTemplateForm.markAllAsTouched();
      this.submitError = 'Please fill all required fields before submitting.';
      return;
    }

    const payload = this.buildSubmitPayload();
    this.lastSubmittedPayload = payload;
    this.isSubmitting = true;

    const request$ =
      this.schedulerService.isEditMode && payload.id
        ? this.schedulerService.updateScheduler(payload.id, payload)
        : this.schedulerService.createScheduler(payload);

    request$.pipe(finalize(() => (this.isSubmitting = false))).subscribe({
      next: () => {
        this.submitSuccess = this.schedulerService.isEditMode
          ? 'Scheduler updated successfully.'
          : 'Scheduler created successfully.';
      },
      error: () => {
        this.submitError = 'Unable to submit scheduler. Please check API server and try again.';
      },
    });
  }

  // onRadio(value: any): void {
  //   this.captureEndDate = this.getRadioId(value) === this.captureEndDateSpecifyValue;
  //   this.applyOperationValidators();
  // }

  onFrequencyRadio(): void {
    this.applyOperationValidators();
  }

  checkBox(event: any): void {
    this.toggleEmailAddress(event);
  }

private toggleEmailAddress(event: any, isPatch = false): void {
  const selectedOptions = Array.isArray(event) ? event : [];
  this.notifyChecked = selectedOptions.some(
    (item: any) => item.name === 'Notify other' && item.checked
  );
  const emailControl = this.operationalTemplateForm.get('emailAddresses');
  if (!emailControl) return;
  if (this.notifyChecked) {
    emailControl.setValidators([Validators.required]);
  } else {
    emailControl.clearValidators();
    if (!isPatch) {
      emailControl.reset([]);
    }
  }
  emailControl.updateValueAndValidity({ emitEvent: false });
}

  private watchFormChanges(): void {
    this.operationalTemplateForm
      .get('target')
      ?.valueChanges.pipe(takeUntil(this.formDestroy$))
      .subscribe(() => this.applyOperationValidators());

    this.operationalTemplateForm
      .get('captureEndDateRadio')
      ?.valueChanges.pipe(takeUntil(this.formDestroy$))
      .subscribe((value) => {
        this.captureEndDate = this.getRadioId(value) === this.captureEndDateSpecifyValue;
        this.applyOperationValidators();
      });
  }

  private applyOperationValidators(): void {
    if (!this.operationalTemplateForm) return;
    Object.keys(this.operationalTemplateForm.controls).forEach((key) => {
      this.operationalTemplateForm.get(key)?.clearValidators();
    });
    this.setRequired('operation');
    if (this.isBackupOrCompliance) {
      this.setRequired([
        'scheduleBy',
        'target',
        'scheduleName',
        'captureStartDate',
        'startTime',
        'startTimeZone',
        'captureEndDateRadio',
      ]);

      if (this.captureEndDate) {
        this.setRequired(['captureEndDate', 'endTime', 'endTimeZone']);
      } else {
        this.resetControls(['captureEndDate', 'endTime', 'endTimeZone']);
      }

      if (this.isTargetDeviceGroup) {
        this.setRequired('deviceGroup');
      } else {
        this.resetControls(['deviceGroup']);
      }
    }
    if (this.operationName === 'Backup & Drift') {
      this.setRequired(['frequency', 'frequencyType', 'referencePoint', 'notifyChanges']);
      this.operationalTemplateForm
        .get('frequency')
        ?.addValidators([Validators.pattern('^[1-9][0-9]*$')]);
    }
    if (this.operationName === 'Compliance Template') {
      this.setRequired([
        'frequencyMode',
        'notifyCompletion',
        'compliancePolicyType',
        'compliancePolicyFeature',
      ]);
      if (this.isFrequencyRepeat) {
        this.setRequired(['frequency', 'frequencyType']);
        this.operationalTemplateForm
          .get('frequency')
          ?.addValidators([Validators.pattern('^[1-9][0-9]*$')]);
      } else {
        this.resetControls(['frequency', 'frequencyType']);
      }
    }
    if (this.operationName === 'Operational Template') {
      this.setRequired(['executionType', 'deviceType', 'device', 'templateTarget']);
    }
    if (this.notifyChecked) {
      this.setRequired('emailAddresses');
    } else {
      this.resetControls(['emailAddresses']);
    }
    Object.keys(this.operationalTemplateForm.controls).forEach((key) => {
      this.operationalTemplateForm.get(key)?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private buildSubmitPayload(): any {
    const raw = this.operationalTemplateForm.getRawValue();
    const payload: any = {
      operation: this.toPayloadValue(raw.operation),
      createdAt: new Date().toISOString(),
    };
    if (this.isBackupOrCompliance) {
      Object.assign(payload, {
        scheduleBy: this.toPayloadValue(raw.scheduleBy),
        target: this.toPayloadValue(raw.target),
        deviceGroup: this.isTargetDeviceGroup ? this.toPayloadValue(raw.deviceGroup) : [],
        scheduleName: raw.scheduleName,
        captureStartDate: raw.captureStartDate,
        startTime: raw.startTime,
        startTimeZone: this.toPayloadValue(raw.startTimeZone),
        captureEndDateType: this.toRadioPayload(raw.captureEndDateRadio, this.optionsRadio),
        captureEndDate: this.captureEndDate ? raw.captureEndDate : null,
        endTime: this.captureEndDate ? raw.endTime : null,
        endTimeZone: this.captureEndDate ? this.toPayloadValue(raw.endTimeZone) : null,
      });
    }

    if (this.operationName === 'Backup & Drift') {
      Object.assign(payload, {
        frequency: Number(raw.frequency),
        frequencyType: this.toPayloadValue(raw.frequencyType),
        referencePoint: this.toPayloadValue(raw.referencePoint),
        notifyChanges: this.toPayloadValue(raw.notifyChanges),
        emailAddresses: this.notifyChecked ? this.toPayloadValue(raw.emailAddresses) : [],
      });
    }

    if (this.operationName === 'Compliance Template') {
      Object.assign(payload, {
        frequencyMode: this.toRadioPayload(raw.frequencyMode, this.frequencyOptions),
        frequency: this.getRadioId(raw.frequencyMode) === this.frequencyRepeatValue ? Number(raw.frequency) : null,
        frequencyType: this.getRadioId(raw.frequencyMode) === this.frequencyRepeatValue ? this.toPayloadValue(raw.frequencyType) : null,
        notifyCompletion: this.toPayloadValue(raw.notifyCompletion),
        emailAddresses: this.notifyChecked ? this.toPayloadValue(raw.emailAddresses) : [],
        compliancePolicyType: this.toPayloadValue(raw.compliancePolicyType),
        compliancePolicyFeature: this.toPayloadValue(raw.compliancePolicyFeature),
        complianceNotifyChanges: this.toPayloadValue(raw.complianceNotifyChanges),
      });
    }

    if (this.operationName === 'Operational Template') {
      Object.assign(payload, {
        executionType: this.toPayloadValue(raw.executionType),
        organization: this.toPayloadValue(raw.organization),
        region: this.toPayloadValue(raw.region),
        site: this.toPayloadValue(raw.site),
        filterDeviceGroup: this.toPayloadValue(raw.filterDeviceGroup),
        deviceType: this.toPayloadValue(raw.deviceType),
        device: this.toPayloadValue(raw.device),
        target: this.toPayloadValue(raw.templateTarget),
      });
    }
    return payload;
  }

  private resetOperationSpecificValues(): void {
    // console.log('resetOperationSpecificValues');
    this.notifyChecked = false;
    this.captureEndDate = true;
    this.resetControls([
      'target',
      'deviceGroup',
      'scheduleName',
      'captureStartDate',
      'startTime',
      'startTimeZone',
      'captureEndDate',
      'endTime',
      'endTimeZone',
      'frequency',
      'frequencyType',
      'emailAddresses',
      'executionType',
      'organization',
      'region',
      'site',
      'filterDeviceGroup',
      'deviceType',
      'device',
      'templateTarget',
      'compliancePolicyType',
      'compliancePolicyFeature',
    ]);
    this.operationalTemplateForm.patchValue(
      {
        captureEndDateRadio: this.captureEndDateSpecifyValue,
        frequencyMode: this.frequencyRepeatValue,
      },
      { emitEvent: false }
    );
  }
  private setRequired(controlNames: string | string[]): void {
    const names = Array.isArray(controlNames) ? controlNames : [controlNames];
    names.forEach((name) => this.operationalTemplateForm.get(name)?.addValidators(Validators.required));
  }

  private resetControls(controlNames: string[]): void {
    controlNames.forEach((name) => {
      const control = this.operationalTemplateForm.get(name);
      const resetValue = Array.isArray(control?.value) ? [] : '';
      control?.reset();
    });
  }

  private toPayloadValue(value: any): any {
    if (Array.isArray(value)) {
      return value.map((item) => this.toPayloadValue(item));
    }

    if (value && typeof value === 'object') {
      return {
        id: value.id ?? value.key ?? value.userid ?? value.email ?? value.name,
        name: value.name ?? value.label ?? value.email,
      };
    }

    return value;
  }

  private toRadioPayload(value: any, options: SelectOption[]): any {
    const selectedId = this.getRadioId(value);
    const selectedOption = options.find((option) => option.id === selectedId);

    if (!selectedOption) {
      return value;
    }

    return {
      id: selectedOption.apiId ?? selectedOption.id,
      name: selectedOption.name,
    };
  }

  private getRadioId(value: any): number | string {
    return value?.id ?? value;
  }

  get operationName(): string {
    return this.operationalTemplateForm?.get('operation')?.value?.name ?? '';
  }

  get isBackupOrCompliance(): boolean {
    return this.operationName === 'Backup & Drift' || this.operationName === 'Compliance Template';
  }

  get isTargetDeviceGroup(): boolean {
    return this.operationalTemplateForm?.get('target')?.value?.name === 'Device Group';
  }

  get isFrequencyRepeat(): boolean {
    return this.getRadioId(this.operationalTemplateForm?.get('frequencyMode')?.value) === this.frequencyRepeatValue;
  }

  isInvalid(controlName: string): boolean {
    const control = this.operationalTemplateForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }



  getAllDropDownList() {
    forkJoin([
      this.schedulerService.getTargetDropDown(),
      this.schedulerService.getFrequencyDropDwon(),
      this.schedulerService.getOperationsDropDown(),
      this.schedulerService.getEmailsList(),
      this.schedulerService.getAllGroupList()
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any[]) => {
          this.targetOptions = res[0].map((item: any, _index: number) => ({
            id: item.key,
            name: item.label,
          }));
          this.frequencyTypeOptions = res[1].map((item: any, _index: number) => ({
            id: item.key ?? item.id,
            name: item.label ?? item.name,
          }))
          this.operationListOptions = res[2].map((item: any, _index: number) => ({
            id: item.key,
            name: item.label,
          }))
          this.emailOptionsList = res[3].map((item: any, _index: number) => ({
            id: item.userid ?? item.email,
            name: item.email,
          }));
          this.deviceGroupOptions = res[4]
        },
        error: (err) => {
          this.submitError = 'Unable to load form dropdowns.';
        }
      });
  }

  isPatching = false;
  getDataByid(id: number): void {
    this.isPatching = true;
    this.schedulerService.getSchedulerById(id).subscribe({
      next: (res) => {
        const notifyCompletion = this.taskOptions.map(option => ({
          ...option,
          checked: res.notifyCompletion?.some(
            (x: any) => x.id === option.id
          ) ?? false
        }));

        const complianceNotifyChanges = this.notiFyOnChanges.map(option => ({
          ...option,
          checked: res.complianceNotifyChanges?.some(
            (x: any) => x.id === option.id
          ) ?? false
        }));
        this.operationalTemplateForm.patchValue(
          {
            operation: res.operation,
            scheduleBy: res.scheduleBy,
            target: res.target,
            deviceGroup: res.deviceGroup,
            scheduleName: res.scheduleName,
            captureStartDate: res.captureStartDate,
            startTime: res.startTime,
            startTimeZone: res.startTimeZone,
            captureEndDateRadio:
              res.captureEndDateType?.id === 1
                ? this.captureEndDateSpecifyValue
                : 'capture_never',
            captureEndDate: res.captureEndDate,
            endTime: res.endTime,
            endTimeZone: res.endTimeZone,
            frequencyMode:
              res.frequencyMode?.id === 1
                ? this.frequencyRepeatValue
                : 'frequency_not_repeat',
            frequency: res.frequency,
            frequencyType: res.frequencyType,
            notifyChanges: res.notifyChanges,
            notifyCompletion: notifyCompletion,
            complianceNotifyChanges: complianceNotifyChanges,
            emailAddresses: res.emailAddresses,
            compliancePolicyType: res.compliancePolicyType,
            compliancePolicyFeature: res.compliancePolicyFeature,
          },
          { emitEvent: false }
        );
        if (res.operation?.name === 'Backup & Drift') {
          this.toggleEmailAddress(res.notifyChanges ,true);
        } else if (res.operation?.name === 'Compliance Template') {
          this.toggleEmailAddress(res.notifyCompletion, true);
        }
        this.captureEndDate =
          res.captureEndDateType?.id === 1;
        this.notifyChecked =
          (res.emailAddresses?.length ?? 0) > 0;
        this.isPatching = false;
        this.applyOperationValidators();
      },
      error: () => {
        this.isPatching = false;
      },
    });
  }

}
