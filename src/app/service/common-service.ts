import { Injectable, signal, WritableSignal } from '@angular/core';


interface WizardData {
  [stepKey: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public stepData: WritableSignal<WizardData> = signal({});

  setCurrentWizardData(stepDataPayload: { stepKey: string; data: any }) {
    console.log(stepDataPayload);
    this.stepData.update((currentData) => {
      return {
        ...currentData,
        [stepDataPayload.stepKey]: stepDataPayload.data,
      };
    });
    console.log(this.stepData);
  }

}
