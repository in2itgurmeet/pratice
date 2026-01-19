import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSlect } from './single-slect';

describe('SingleSlect', () => {
  let component: SingleSlect;
  let fixture: ComponentFixture<SingleSlect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleSlect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleSlect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
