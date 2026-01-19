import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Type,
} from '@angular/core';
import { WizardInterface } from '../wizard-interface';
import { FeatherModule } from 'angular-feather';
import { Common } from '../common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'userManagement-common-wizard',
  imports: [CommonModule, FeatherModule, FormsModule],
  templateUrl: './common-wizard.html',
  styleUrl: './common-wizard.scss',
})
export class CommonWizard {
  @Input() wizardId: string = 'connection';
  @Input() wizardTitle: string = 'Create New Product';
  @Input() dynamicSteps: WizardInterface[] = [];
  @Output() closeWizardEmitter = new EventEmitter();

  constructor(public commonService: Common) { }

  ngOnChanges(changes: any) {
    const initialConfig = this.dynamicSteps.map((s, i) => ({
      title: s.title,
      state: i === 0 ? 'active' : 'normal',
    }));
    this.commonService.activeStep.set({ [this.wizardId]: 1 });
    this.commonService.stepConfig.set({ [this.wizardId]: initialConfig });
  }

  ngOnInit(): void {
    const initialConfig = this.dynamicSteps.map((s, i) => ({
      title: s.title,
      state: i === 0 ? 'active' : 'normal',
    }));

    this.commonService.activeStep.set({ [this.wizardId]: 1 });
    this.commonService.stepConfig.set({ [this.wizardId]: initialConfig });
  }

  get stepsConfigArray(): any[] {
    return this.commonService.stepConfig()?.[this.wizardId] || [];
  }
  get activeStepNumber(): number {
    return this.commonService.activeStep()?.[this.wizardId] || 1;
  }

  get currentStepComponent(): Type<any> | undefined {
    const step = this.activeStepNumber;
    return this.dynamicSteps[step - 1]?.component;
  }

  get currentStepConfig(): WizardInterface | undefined {
    const step = this.activeStepNumber;
    return this.dynamicSteps[step - 1];
  }
  closeWizard(from: string = '') {
    this.closeWizardEmitter.emit(from);
  }
  getComponentInputs(): { [key: string]: any } {
    const config = this.currentStepConfig;
    if (!config) {
      return {};
    }
    const inputs: { [key: string]: any } = {
      contextId: this.wizardId,
    };
    if (config.data) {
      Object.assign(inputs, config.data);
    }
    return inputs;
  }
}
