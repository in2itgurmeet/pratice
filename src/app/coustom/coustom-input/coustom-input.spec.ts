import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoustomInput } from './coustom-input';

describe('CoustomInput', () => {
  let component: CoustomInput;
  let fixture: ComponentFixture<CoustomInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoustomInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoustomInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
