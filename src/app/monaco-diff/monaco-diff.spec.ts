import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonacoDiff } from './monaco-diff';

describe('MonacoDiff', () => {
  let component: MonacoDiff;
  let fixture: ComponentFixture<MonacoDiff>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonacoDiff]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonacoDiff);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
