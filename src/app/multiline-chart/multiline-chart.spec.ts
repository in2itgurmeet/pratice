import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilineChart } from './multiline-chart';

describe('MultilineChart', () => {
  let component: MultilineChart;
  let fixture: ComponentFixture<MultilineChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultilineChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultilineChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
