import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickLocationMap } from './pick-location-map';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { BsModalService } from 'ngx-bootstrap/modal';

describe('PickLocationMap', () => {
  let component: PickLocationMap;
  let fixture: ComponentFixture<PickLocationMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickLocationMap, HttpClientTestingModule, FeatherModule.pick(allIcons)],
      providers: [BsModalService],
    }).compileComponents();

    fixture = TestBed.createComponent(PickLocationMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
