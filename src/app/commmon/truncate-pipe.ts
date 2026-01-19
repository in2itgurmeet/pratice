import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, limit: number, trail: string = '...'): string {
    if (value === null || value === undefined) {
      return '';
    }
    const stringValue = String(value);

    if (stringValue.length > limit) {
      return stringValue.substring(0, limit) + trail;
    }
    return stringValue;
  }
}
