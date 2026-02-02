import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';

import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';


import { CommonModule } from '@angular/common';

export interface AutoCompleteSingleSelectConfig {
  idField: string;
  textField: string;
  disabledField: string;
  placeholder: string;
  required: boolean;
  customInput?: boolean;
}


@Component({
  selector: 'app-coustom-input',
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,  //access to value by form Controll
      useExisting: forwardRef(() => CoustomInput),
      multi: true,
    },
  ],
  templateUrl: './coustom-input.html',
  styleUrl: './coustom-input.scss',
})
export class CoustomInput implements ControlValueAccessor, OnInit {

  @Input() autoSingleSelectConfig: AutoCompleteSingleSelectConfig = {
    idField: '',
    textField: 'name',
    disabledField: '',
    placeholder: 'Enter or Select',
    required: false,
    customInput: false,
  }

  @Input() selectedItem: any;

  @Input() optionsList: any[] = [];

  @Input() parentNativeElement: any;

  @Output() onItemSelection = new EventEmitter();

  @Output() onScroll: any = new EventEmitter();

  showDropdown: boolean = false;

  inputValue: string = '';
  private onChange = (_: any) => { };
  private onTouched = () => { };
  isDisabled = false;
  selectedOption: any;

  constructor() { }
  writeValue(value: any): void {
    this.selectedOption = value;
    if (!value) {
      this.inputValue = '';
      return;
    }
    if (typeof value === 'object') {
      this.inputValue = value[this.autoSingleSelectConfig.textField];
    } else {
      this.inputValue = value;
    }
  }



  // isme hme value ke chnage hone ya update hone ka pta chlega OR YE TABHI TRIGGERD HOGA
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // isme hme value ke touched hone ka pta chlega OR YE TABHI TRIGGERD HOGA

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }


  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }



  ngOnInit(): void {
    console.log(this.optionsList);
  }



  /**

   * @description Method to toggle dropdown list

   * @author Shiva Kant

   */

  toggleDropdown(): void {

    this.showDropdown = !this.showDropdown;

    if (this.parentNativeElement) {

      this.parentNativeElement.scrollIntoView({

        behavior: 'smooth',

        block: 'center',

      });

      let parentDiv = document.getElementById(this.parentNativeElement);

      setTimeout(() => {

        let parentBoundary = parentDiv?.getBoundingClientRect() || ({} as any);

        let dropdonwList: any = document.getElementById('container_scroll');

        let elBoundary = dropdonwList?.getBoundingClientRect() || {};

        if (parentBoundary?.['bottom'] < elBoundary?.['bottom']) {

          dropdonwList.style['transform'] = `translate(0px,-${elBoundary?.['height'] + 54

            }px`;

        }

      }, 20);

    }

  }

  /**

   * @description method to update selected item

   * @author Shiva Kant

   * @param item this is selected item from list

   * @param type type of list

   * @returns none

   */

  updateSelectedItem(item: any, type: string): void {

    this.inputValue =
      type === 'object'
        ? item[this.autoSingleSelectConfig.textField]
        : item;


    this.selectedOption = item;

    this.showDropdown = false;

    this.onChange(item);

    this.onItemSelection.emit(item);

  }

  /**

   * @description this method is use to update input value

   */

  updateInputValue(): void {
    if (!this.inputValue) {
      this.selectedOption = null;
      this.onChange(null);
      this.onItemSelection.emit(null);
      this.showDropdown = false;
      return;
    }
    let data = this.selectedOption;
    if (!data ||
      (typeof data === 'object' ? data[this.autoSingleSelectConfig.textField] !== this.inputValue : data !== this.inputValue)) {
      data = this.inputValue;
      if (this.isObject(this.optionsList?.[0])) {
        data = {
          [this.autoSingleSelectConfig.idField]: null, [this.autoSingleSelectConfig.textField]: this.inputValue,
        };
      }
    }
    this.selectedOption = data;
    this.onChange(data);
    this.onItemSelection.emit(data);
    this.showDropdown = false;
  }




  /**
   * @description method to update dropdown list state on input type
   * @author Shiva Kant
   */

  updateDropdownStatus(): void {
    if (this.isDisabled) return;
    this.showDropdown = !!this.inputValue;
  }

  onInputChange(): void {
    if (!this.inputValue) {
      this.selectedOption = null;
      this.onChange(null);
      this.onItemSelection.emit(null);
      this.showDropdown = false;
    }
  }


  /**
   * @description method to check if the list is Array of string or object
   * @author Shiva Kant
   * @param data this is the any one one item of list
   * @returns boolean
   */

  isObject(data: any): boolean {
    return data && typeof data !== 'string';
  }
  /**
   * @description This method is use to close dropdown on click outside
   */
  // outsideClicked(): void {
  //   if (this.showDropdown) {
  //     if (this.autoSingleSelectConfig.customInput) {
  //       this.updateInputValue();
  //     }
  //   }
  //   this.showDropdown = false;
  // }
  getFilteredOptions(): any[] {
    if (!this.inputValue) return this.optionsList;

    if (this.isObject(this.optionsList?.[0])) {
      return this.optionsList.filter(item =>
        item[this.autoSingleSelectConfig.textField]
          .toLowerCase()
          .includes(this.inputValue.toLowerCase())
      );
    }

    return this.optionsList.filter(item =>
      item.toLowerCase().includes(this.inputValue.toLowerCase())
    );
  }

  outsideClicked(): void {
    if (!this.inputValue) {
      this.selectedOption = null;
      this.onChange(null);
      this.onItemSelection.emit(null);
    } else if (this.showDropdown && this.autoSingleSelectConfig.customInput) {
      this.updateInputValue();
    }
    this.showDropdown = false;
    this.onTouched();
  }


  onClickEnter(event: any): void {
    const filteredOptions = this.getFilteredOptions();
    if (filteredOptions.length > 0) {
      const firstItem = filteredOptions[0];
      this.updateSelectedItem(
        firstItem,
        this.isObject(firstItem) ? 'object' : 'string'
      );
    } else if (this.autoSingleSelectConfig.customInput) {
      this.updateInputValue();
    }
    this.onTouched();
    this.showDropdown = false;
  }

}
