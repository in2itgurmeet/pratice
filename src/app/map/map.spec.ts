import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Map } from './map';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { BsModalService } from 'ngx-bootstrap/modal';

describe('Map', () => {
  let component: Map;
  let fixture: ComponentFixture<Map>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Map, HttpClientTestingModule, FeatherModule.pick(allIcons)],
      providers: [BsModalService],
    }).compileComponents();

    fixture = TestBed.createComponent(Map);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
