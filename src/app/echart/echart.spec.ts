import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Echart } from './echart';

describe('Echart', () => {
  let component: Echart;
  let fixture: ComponentFixture<Echart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Echart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Echart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
