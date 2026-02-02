import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';

import { ApiService } from '../service/api-service';
import { PickLocationMap } from './pick-location-map/pick-location-map';
import { SingleSelectCustomComponent } from '../coustom/single-select-coustom/single-select-coustom';
import { CoustomInput } from "../coustom/coustom-input/coustom-input";


@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [FormsModule, PickLocationMap, ReactiveFormsModule, SingleSelectCustomComponent, CoustomInput],
  templateUrl: './forms.html',
  styleUrls: ['./forms.scss'],
})
export class Forms implements OnInit {

  optionList: any[] = [
    { id: 1, name: 'Get' },
    { id: 2, name: 'Set' },
    { id: 3, name: 'Post' },
    { id: 4, name: 'Put' },
    { id: 5, name: 'Patch' },
    { id: 6, name: 'Delete' },
    { id: 7, name: 'Options' },
  ];
  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(),
    skill: new FormArray([new FormControl('')]),
  });
  allData: any[] = [];
  autoSingleSelectConfig = {
    idField: 'id',
    textField: 'name',
    disabledField: '',
    placeholder: 'Enter name',
    required: false,
    customInput: true
  };

  @ViewChild('location', { static: true })
  location!: TemplateRef<any>;

  constructor(private service: ApiService, private modalService: BsModalService) {
    // this.form.get('name')?.statusChanges.subscribe((status) => {
    //   console.log(status);
    // });
  }

  get skill() {
    return this.form.get('skill') as FormArray;
  }
  addSkill() {
    this.skill.push(new FormControl(''));
  }
  removeSkill(i: number) {
    this.skill.removeAt(i);
  }

  ngOnInit() {
    // this.getdata();
  }

  user = {
    name: '',
    username: '',
    email: '',
    phone: '',
    website: '',
    address: {
      street: '',
      suite: '',
      city: '',
      zipcode: '',
      geo: {
        lat: '',
        lng: '',
      },
    },
    company: {
      name: '',
      catchPhrase: '',
      bs: '',
    },
  };

  onSubmit(userData: any) {
    this.service.sendData(userData.value).subscribe(() => {
      console.log(userData.value);
    });
  }

  getdata() {
    this.service.getUserdata().subscribe({
      next: (res) => {
        if (!res) return
        this.allData = res;
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  openLocationModal() {
    this.modalService.show(this.location);
  }

  patchLocation(loc: any) {
    if (!loc) return;
    this.user.address.street = loc.address || '';
    this.user.address.geo.lat = loc.lat ?? loc.latitude ?? '';
    this.user.address.geo.lng = loc.lng ?? loc.longitude ?? '';
  }

  closeMapModal() {
    this.modalService.hide();
  }
  /**
   * @description This function is used to open the map modal
   * @author Gurmeet Kumar
   * return void
   */
  openModal() {
    this.modalService.show(this.location, {
      class: 'largeModel',
      keyboard: false,
      ignoreBackdropClick: true,
    });
  }
  onSubmitForm() {
    console.log(this.form.getRawValue());
  }
  closeConnectionWizard(e: any) {
    this.modalService.hide();
  }
  getVlaue(event: any) {
    console.log(event);

  }
  getEvents(events: any) {
    console.log(events);
  }
}
