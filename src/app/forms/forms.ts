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


@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [FormsModule, PickLocationMap, ReactiveFormsModule,],
  templateUrl: './forms.html',
  styleUrls: ['./forms.scss'],
})
export class Forms implements OnInit {


  form: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl({ value: '', disabled: true }),
    skill: new FormArray([new FormControl('')]),
  });
  allData: any[] = [];

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
    this.getdata();
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
    this.service.getUserdata().subscribe((res: any) => {
      if (res) {
        this.allData = res;
        this.service.userData = this.allData;
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


}
