import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  signal,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { FeatherModule } from 'angular-feather';

@Component({
  selector: 'app-single-select-custom',
  standalone: true,
  imports: [CommonModule, FeatherModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleSelectCustomComponent),
      multi: true,
    },
  ],
  templateUrl: './single-select-coustom.html',
  styleUrl: './single-select-coustom.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleSelectCustomComponent implements ControlValueAccessor {
  showOptionList = signal<boolean>(false);
  @Input() optionList: any[] = [];
  @Input() disabledList: any[] = [];
  @Input() searchRequired = false;
  @Input() placeholder = 'Select option';
  @Output() selectedValueChange = new EventEmitter<any>();

  @Input() config = {
    idField: 'id',
    textField: 'name',
    disabledField: 'isDisabled',
  };

  selectedValue: any = null;
  searchText = '';
  disabled = false;
  private onChange = (_: any) => { };
  private onTouched = () => { };

  constructor(private el: ElementRef) { }
  toggleSingleSelect(): void {
    this.showOptionList.set(!this.showOptionList());
  }

  selectOption(item: any): void {
    this.selectedValue = item;
    this.onChange(item);
    this.onTouched();
    this.showOptionList.set(false);
    this.selectedValueChange.emit(item);
  }

  display(option: any): string {
    return typeof option === 'object'
      ? option?.[this.config.textField]
      : option;
  }

  isSelected(option: any): boolean {
    if (!this.selectedValue) return false;
    if (typeof option === 'object') {
      return (
        option[this.config.idField] ===
        this.selectedValue?.[this.config.idField]
      );
    }
    return option === this.selectedValue;
  }

  writeValue(value: any): void {
    this.selectedValue = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  @HostListener('document:click', ['$event'])
  closeOnOutside(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.showOptionList.set(false);
      this.onTouched();
    }
  }
}
