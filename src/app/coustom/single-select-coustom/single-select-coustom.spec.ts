import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSelectCustomComponent } from './single-select-coustom';

describe('SingleSelectCustomComponent', () => {
  let component: SingleSelectCustomComponent;
  let fixture: ComponentFixture<SingleSelectCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleSelectCustomComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SingleSelectCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
