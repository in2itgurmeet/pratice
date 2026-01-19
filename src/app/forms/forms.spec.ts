import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forms } from './forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { allIcons } from 'angular-feather/icons';
import { FeatherModule } from 'angular-feather';
import { BsModalService } from 'ngx-bootstrap/modal';

describe('Forms', () => {
  let component: Forms;
  let fixture: ComponentFixture<Forms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forms, HttpClientTestingModule, FeatherModule.pick(allIcons)],
      providers: [BsModalService],
    }).compileComponents();

    fixture = TestBed.createComponent(Forms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
