import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addresss } from './addresss';

describe('Addresss', () => {
  let component: Addresss;
  let fixture: ComponentFixture<Addresss>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addresss]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addresss);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
