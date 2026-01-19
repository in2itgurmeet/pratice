import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTable } from './users-table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CatsDataGridComponent } from 'cats-data-grid';

describe('UsersTable', () => {
  let component: UsersTable;
  let fixture: ComponentFixture<UsersTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersTable, HttpClientTestingModule, CatsDataGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
