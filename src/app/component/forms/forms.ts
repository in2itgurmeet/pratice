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
    this.scheduleByOptions = [
      { id: 1, name: 'kumargumeet096@gmail.com' },
    ]
    this.initializeSchedulerDetailsForm();
    this.watchFormChanges();

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
      scheduleBy: new FormControl({ value: { id: 'device_group', name: 'Device Group' }, disabled: true }),
      target: new FormControl(''),
      deviceGroup: new FormControl(''),
      scheduleName: new FormControl(''),
      captureStartDate: new FormControl(''),
      startTime: new FormControl(''),
      startTimeZone: new FormControl(''),
      captureEndDate: new FormControl(''),
      endTime: new FormControl(''),
      endTimeZone: new FormControl(''),
      captureEndDateRadio: new FormControl(1, Validators.required),
      frequencyMode: new FormControl(1),
      frequency: new FormControl(''),
      frequencyType: new FormControl(''),
      referencePoint: new FormControl({ value: { id: 1, name: 'Previous Snapshot' }, disabled: true }),
      notifyChanges: new FormControl(this.getDefaultSelectedOptions(this.taskOptions)),
      notifyCompletion: new FormControl(this.getDefaultSelectedOptions(this.taskOptions)),
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
      complianceNotifyChanges: new FormControl(this.getDefaultSelectedOptions(this.notiFyOnChanges)),
    });
    this.applyOperationValidators();
  }

  clearForm(): void {
    this.submitted = false;
    this.submitSuccess = '';
    this.submitError = '';
    this.notifyChecked = false;
    this.captureEndDate = true;
    this.operationalTemplateForm.reset({
      scheduleBy: { id: 'device_group', name: 'Device Group' },
      captureEndDateRadio: 1,
      frequencyMode: 1,
      referencePoint: { id: 1, name: 'Previous Snapshot' },
      notifyChanges: this.getDefaultSelectedOptions(this.taskOptions),
      notifyCompletion: this.getDefaultSelectedOptions(this.taskOptions),
      emailAddresses: [],
      filterDeviceGroup: [],
      complianceNotifyChanges: this.getDefaultSelectedOptions(this.notiFyOnChanges),
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

  onRadio(value: any): void {
    this.captureEndDate = this.getRadioId(value) === 1;
    this.applyOperationValidators();
  }

  onFrequencyRadio(): void {
    this.applyOperationValidators();
  }

  checkBox(event: any): void {
    this.toggleEmailAddress(event);
  }

  private toggleEmailAddress(event: any): void {
    const selectedOptions = Array.isArray(event) ? event : [];
    this.notifyChecked = selectedOptions.some(
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

  private watchFormChanges(): void {
    this.operationalTemplateForm
      .get('operation')
      ?.valueChanges.pipe(takeUntil(this.formDestroy$))
      .subscribe(() => {
        this.resetOperationSpecificValues();
        this.applyOperationValidators();
      });

    this.operationalTemplateForm
      .get('target')
      ?.valueChanges.pipe(takeUntil(this.formDestroy$))
      .subscribe(() => this.applyOperationValidators());

    this.operationalTemplateForm
      .get('captureEndDateRadio')
      ?.valueChanges.pipe(takeUntil(this.formDestroy$))
      .subscribe((value) => {
        this.captureEndDate = this.getRadioId(value) === 1;
        this.applyOperationValidators();
      });

    this.operationalTemplateForm
      .get('frequencyMode')
      ?.valueChanges.pipe(takeUntil(this.formDestroy$))
      .subscribe(() => this.applyOperationValidators());
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

      if (this.getRadioId(this.operationalTemplateForm.get('frequencyMode')?.value) === 1) {
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
        captureEndDateType: this.toPayloadValue(raw.captureEndDateRadio),
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
        frequencyMode: this.toPayloadValue(raw.frequencyMode),
        frequency: this.getRadioId(raw.frequencyMode) === 1 ? Number(raw.frequency) : null,
        frequencyType: this.getRadioId(raw.frequencyMode) === 1 ? this.toPayloadValue(raw.frequencyType) : null,
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
        captureEndDateRadio: 1,
        frequencyMode: 1,
        notifyChanges: this.getDefaultSelectedOptions(this.taskOptions),
        notifyCompletion: this.getDefaultSelectedOptions(this.taskOptions),
        complianceNotifyChanges: this.getDefaultSelectedOptions(this.notiFyOnChanges),
      },
      { emitEvent: false }
    );
  }

  private getDefaultSelectedOptions(options: any[]): any[] {
    return options.filter((option) => option.checked);
  }

  private setRequired(controlNames: string | string[]): void {
    const names = Array.isArray(controlNames) ? controlNames : [controlNames];
    names.forEach((name) => this.operationalTemplateForm.get(name)?.addValidators(Validators.required));
  }

  private resetControls(controlNames: string[]): void {
    controlNames.forEach((name) => {
      const control = this.operationalTemplateForm.get(name);
      const resetValue = Array.isArray(control?.value) ? [] : '';
      control?.reset(resetValue, { emitEvent: false });
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
}
