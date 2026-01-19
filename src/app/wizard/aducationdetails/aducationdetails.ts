import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Common } from '../../commmon/common';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { WizardService } from './wizard-service';

@Component({
  selector: 'app-aducationdetails',
  imports: [ReactiveFormsModule, CommonModule, FeatherModule],
  templateUrl: './aducationdetails.html',
  styleUrl: './aducationdetails.scss',
})
export class Educationdetails {
  wizardId = 'user-details';
  userForm!: FormGroup;
  configue: any = {
    idField: 'id',
    textField: 'name',
  };

  constructor(private common: Common, private wizardService: WizardService) { }

  previous() {
    this.common.previousStep(this.wizardId);
  }
  next() {
    this.wizardService.setCurrentWizardData({
      stepKey: 'aducationdetails',
      data: this.userForm.value,
    })
    this.common.nextStep(this.wizardId);
  }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      heigestQualification: new FormControl('', Validators.required),
      subject: new FormArray([
        new FormControl(''),
      ]),
    });
  }


  get subject() {
    return this.userForm.get('subject') as FormArray;
  }
  addSkill() {
    this.subject.push(new FormControl(''));
  }
  removeSkill(i: number) {
    this.subject.removeAt(i);
  }
  onSubmit() {
    this.next();
    this.userForm.reset();
    this.subject.clear();
    this.wizardService.closeConnectionWizard();
  }
}

