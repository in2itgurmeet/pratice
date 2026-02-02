import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Common } from '../../commmon/common';
import { CommonModule } from '@angular/common';
import { WizardService } from '../aducationdetails/wizard-service';
import { SingleSelectComponent } from "cats-ui-lib";

@Component({
  selector: 'app-addresss',
  imports: [CommonModule, ReactiveFormsModule, SingleSelectComponent],
  templateUrl: './addresss.html',
  styleUrl: './addresss.scss',
})
export class Addresss {
  country: any = null;
  state: any;
  city: any;
  stateCode: any;
  countryCode: any;
  wizardId = 'user-details';
  adrressForm!: FormGroup;
  configue = {
    idField: 'isoCode',
    textField: 'name',
    disabledField: 'isDisabled',
    placeholder: 'Select Options',
  };

  constructor(private common: Common, private service: WizardService, private wizardService: WizardService) {
    this.adrressForm = new FormGroup({
      country: new FormControl(''),
      state: new FormControl(''),
      city: new FormControl(''),
    });
  }

  previous() {
    this.common.previousStep(this.wizardId);
  }
  next() {
    this.wizardService.setCurrentWizardData({
      stepKey: 'addresss',
      data: this.adrressForm.value,
    })
    this.common.nextStep(this.wizardId);
  }

  onSubmit() {
    this.next();
    this.adrressForm.reset();
  }

  ngOnInit(): void {
    this.getCountry();
  }

  getCountry() {
    this.service.getCountry().subscribe((country) => {
      this.country = country;
    });
  }

  onSelectedChangeCountry(event: any) {
    this.service.getStatedata(event.isoCode).subscribe((stateData) => {
      this.state = stateData;
      this.stateCode = this.state.stateCode;
      this.countryCode = event.isoCode;
    });
  }
  onSelectedChangeState(event: any) {
    this.service
      .getCity(this.countryCode, event.isoCode)
      .subscribe((citydata) => {
        this.city = citydata;
      });
  }

}
