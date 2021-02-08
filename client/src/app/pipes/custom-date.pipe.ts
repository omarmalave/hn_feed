import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate',
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value.replace('.000Z', ''));
    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    if (this.sameDate(date, today)) {
      return (
        new DatePipe('en-US').transform(date, 'shortTime') || date.toString()
      );
    }
    if (this.sameDate(date, yesterday)) {
      return 'Yesterday';
    }
    return new DatePipe('en-US').transform(date, 'MMM d') || date.toString();
  }

  sameDate(someDate: Date, someOtherDate: Date): boolean {
    return (
      someDate.getDate() === someOtherDate.getDate() &&
      someDate.getMonth() === someOtherDate.getMonth() &&
      someDate.getFullYear() === someOtherDate.getFullYear()
    );
  }
}
