import { Component, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { CatsDataGridComponent } from 'cats-data-grid';
import { InputComponent, SingleSelectComponent, SingleSelectConfig } from 'cats-ui-lib';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule,],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  title = signal('practice');
  name = model();
  names = '';

  // Single select config
  configue: SingleSelectConfig = {
    idField: 'id',
    textField: 'name',
    placeholder: 'Select an option',
    enableSearch: true,
    required: false,
  };
  ngOnInit(): void { }

  optionList = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
    { id: 3, name: 'Option 3' },
    { id: 4, name: 'Option 4' },
    { id: 5, name: 'Option 5' },
    { id: 6, name: 'Option 6' },
    { id: 7, name: 'Option 7' },
    { id: 8, name: 'Option 8' },
    { id: 9, name: 'Option 9' },
    { id: 10, name: 'Option 10' },
  ];

  // Data Grid rowData
  rowData = [
    { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
    { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
    { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
  ];

  // Column definitions
  colDefs = [
    { headerName: 'Make', fieldName: 'make' },
    { headerName: 'Model', fieldName: 'model' },
    { headerName: 'Price', fieldName: 'price' },
    { headerName: 'Electric', fieldName: 'electric' },
  ];

  // Input change event
  inputValueChange(event: any) {
    this.names = event.target.value;
  }
}
