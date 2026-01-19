import { WizardService } from './../aducationdetails/wizard-service';
import { Common } from './../../commmon/common';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss',
})
export class UserDetails implements OnInit {
  wizardId = 'user-details';
  userForm!: FormGroup;
  wizardData = signal({});
  constructor(private common: Common, private WizardService: WizardService) { }

  previous() {
    this.common.previousStep(this.wizardId);
  }
  next() {
    this.WizardService.setCurrentWizardData({
      stepKey: 'userDetails',
      data: this.userForm.value,
    });
    this.common.nextStep(this.wizardId);
  }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      fatherName: new FormControl('', Validators.required),
      motherName: new FormControl('', Validators.required),
    });
    let selectedData = this.WizardService.stepData()?.['userDetails'];
    if (selectedData) {
      this.userForm.patchValue(selectedData);
    }
  }
  onSubmit() {
    this.next();
    this.userForm.reset();
  }

}