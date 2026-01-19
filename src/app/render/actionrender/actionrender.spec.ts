import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Actionrender } from './actionrender';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

describe('Actionrender', () => {
  let component: Actionrender;
  let fixture: ComponentFixture<Actionrender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Actionrender, HttpClientTestingModule, FeatherModule.pick(allIcons)],
    }).compileComponents();

    fixture = TestBed.createComponent(Actionrender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
