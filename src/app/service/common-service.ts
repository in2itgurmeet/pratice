import { Injectable, signal, WritableSignal } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

interface WizardData {
  [stepKey: string]: any;
}
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public stepData: WritableSignal<WizardData> = signal({});
  constructor(private modalService: BsModalService) { }
  setCurrentWizardData(stepDataPayload: { stepKey: string; data: any }) {
    this.stepData.update((currentData) => {
      return {
        ...currentData,
        [stepDataPayload.stepKey]: stepDataPayload.data,
      };
    });
  }



  closeConnectionWizard() {
    this.modalService.hide();
  }

}
