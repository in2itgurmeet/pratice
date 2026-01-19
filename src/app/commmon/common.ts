import { Injectable, signal, WritableSignal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { timer } from 'rxjs';

export type PopupConfig = {
  confirmButtonText: string;
  imageUrl?: string;
  message?: string;
  title?: string;
  description?: string;
  closeButtonRequired?: boolean;
  cancelButtonText?: string;
} & ({ title: string } | { message: string });

export interface stepconfig {
  title: string;
  state: 'done' | 'normal' | 'active';
}
export const namePattern = /^[a-zA-Z0-9\-]+(\s[a-zA-Z0-9\-]+)*$/;
export const emailPattern =
  /^(?!.*@.*@)(?!.*gmail\.com.*gmail\.com)(?!.*\.in\.[A-Za-z])([A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*)@([A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z]{2,63})+)$/i;
@Injectable({
  providedIn: 'root',
})
export class Common {
  loaderCounter = 0;
  constructor(private sanitizer: DomSanitizer) {}
  headerTitle = signal<string>('');
  connectionName: string = '';
  // Below are the methods and props for custom-wizard
  activeStep = signal<any>({});
  stepConfig = signal<any>({});
  isModalOpen = signal<boolean>(false);
  allUsersList: WritableSignal<any[]> = signal([]);

  //Below are the signals and methods for toast

  toastArr = signal<any[]>([]);
  toastArr1 = signal<any[]>([]);

  setToastArray(
    data: any,
    type:
      | 'success'
      | 'save'
      | 'generic'
      | 'delete'
      | 'error'
      | 'notification'
      | 'warning'
      | 'processing'
  ): void {
    let item: any = {
      type: type,
      timestamp: Date.now(),
      toastData: data,
    };
    const arr1 = this.toastArr();
    arr1.push(item);
    this.toastArr.set([...arr1]);
    setTimeout(() => {
      const arr = this.toastArr();
      let ind = arr.findIndex((itm: any) => itm.timestamp == item.timestamp);
      if (ind >= 0) arr.splice(ind, 1);
      this.toastArr.set([...arr]);
    }, 10000);
  }
  setToastArrayWBtn(
    data: any,
    action: { text: string; callback: () => void },
    type:
      | 'success'
      | 'save'
      | 'generic'
      | 'delete'
      | 'error'
      | 'notification'
      | 'warning'
      | 'processing'
  ): void {
    let item: any = {
      type: type,
      timestamp: Date.now(),
      toastData: data,
      action: action,
    };

    const arr1 = this.toastArr1();
    arr1.push(item);
    this.toastArr1.set([...arr1]);
    setTimeout(() => {
      const arr = this.toastArr();
      let ind = arr.findIndex((itm: any) => itm.timestamp == item.timestamp);
      if (ind >= 0) arr.splice(ind, 1);
      this.toastArr1.set([...arr]);
    }, 10000);
  }

  removeToastItem(timestamp: any): void {
    const arr = this.toastArr();
    let ind = arr.findIndex((itm: any) => itm.timestamp == timestamp);
    if (ind >= 0) arr.splice(ind, 1);
    this.toastArr.set([...arr]);
  }
  removeToastItemWBtn(timestamp: any): void {
    const arr = this.toastArr1();
    let ind = arr.findIndex((itm: any) => itm.timestamp == timestamp);
    if (ind >= 0) arr.splice(ind, 1);
    this.toastArr1.set([...arr]);
  }
  nextStep(wizardId: string): void {
    const currentStep = this.activeStep()?.[wizardId] || 1;
    const stepConfig = this.stepConfig()?.[wizardId] ?? [];

    if (currentStep <= stepConfig.length) {
      // Immutable update to avoid ExpressionChanged errors
      const updatedStepConfig = stepConfig.map((s: any, i: number) => {
        if (i < currentStep - 1) return { ...s, state: 'done' };
        if (i === currentStep - 1) return { ...s, state: 'done' };
        if (i === currentStep) return { ...s, state: 'active' };
        return { ...s };
      });

      // update signals atomically
      this.stepConfig.update((config: any) => ({ ...config, [wizardId]: updatedStepConfig }));
      this.activeStep.update((obj: any) => ({ ...obj, [wizardId]: currentStep + 1 }));
    }
  }

  previousStep(wizardId: string): void {
    const currentStep = this.activeStep()?.[wizardId] || 1;
    const stepConfig = this.stepConfig()?.[wizardId] ?? [];

    if (currentStep > 1) {
      const updatedStepConfig = stepConfig.map((s: any, i: number) => {
        if (i < currentStep - 2) return { ...s, state: 'done' };
        if (i === currentStep - 2) return { ...s, state: 'active' };
        if (i === currentStep - 1) return { ...s, state: 'normal' };
        return { ...s };
      });

      this.stepConfig.update((config: any) => ({ ...config, [wizardId]: updatedStepConfig }));
      this.activeStep.update((obj: any) => ({ ...obj, [wizardId]: currentStep - 1 }));
    }
  }

  gotoStep(step: number, wizardId: string): void {
    this.stepConfig.update((config) => {
      let stepConfig = config?.[wizardId];

      if (step > 0 && step <= stepConfig?.length) {
        stepConfig = stepConfig.map((stepData: any, index: number) => {
          if (index < step - 1) {
            return { ...stepData, state: 'done' };
          } else if (index == step - 1) {
            return { ...stepData, state: 'active' };
          }
          return stepData;
        });
        config[wizardId] = stepConfig;
        this.activeStep.update((obj: any) => {
          obj[wizardId] = step;
          return obj;
        });
      }
      return config;
    });
  }

  // Methods and Props for Alert/Notification Box
  private popupConfig = signal<PopupConfig>({
    confirmButtonText: 'Okay',
    message: '',
    cancelButtonText: '',
  });

  show = signal<boolean>(false);
  resolveFunc: any;

  showPopUp(config: PopupConfig): Promise<any> {
    this.show.set(false);
    this.popupConfig.set({
      ...config,
    });
    this.show.set(true);

    return new Promise((resolve, _reject) => {
      this.resolveFunc = resolve;
    });
  }

  hidePopUp(): void {
    this.show.set(false);
  }

  getPopupConfig(): PopupConfig {
    return this.popupConfig();
  }

  toUpperWithSpaces(input: string): string {
    if (!input) return '';

    return (
      input
        // convert snake_case with space
        .replace(/_/g, ' ')
        // split camelCase or PascalCase with add space
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // trim & convert to uppercase
        .trim()
        .toUpperCase()
    );
  }

  createColDefs(data: any[]): { headerName: string; fieldName: string; dataType: string }[] {
    if (!Array.isArray(data) || data.length === 0) return [];

    return Object.keys(data[0]).map((key) => {
      return {
        headerName: this.toUpperWithSpaces(key),
        fieldName: key,
        dataType: 'text',
      };
    });
  }

  isLoading = signal(false);

  showLoader(): void {
    this.isLoading.set(true);
  }

  hideLoader(): void {
    this.isLoading.set(false);
  }

  getImageFromBase64(base64string: string): any {
    if (base64string) {
      // const fullBase64String = `data:${base64string};base64,${base64string}`;
      return this.sanitizer.bypassSecurityTrustUrl(base64string);
    }
  }
}
