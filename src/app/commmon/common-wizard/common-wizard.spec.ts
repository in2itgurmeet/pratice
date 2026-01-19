import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonWizard } from './common-wizard';

describe('CommonWizard', () => {
  let component: CommonWizard;
  let fixture: ComponentFixture<CommonWizard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonWizard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonWizard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
