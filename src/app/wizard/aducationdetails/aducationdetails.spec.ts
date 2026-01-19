import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Educationdetails } from './aducationdetails';

describe('Educationdetails', () => {
  let component: Educationdetails;
  let fixture: ComponentFixture<Educationdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Educationdetails]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Educationdetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
