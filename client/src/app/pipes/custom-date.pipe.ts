import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate',
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string): string {
    const offset = new Date().getTimezoneOffset() / 60; // Calculate localtime offset
    const inputDate = new Date(value.replace('.000Z', ''));
    inputDate.setHours(inputDate.getHours() - offset); // subtract offset from original date

    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    if (this.sameDate(inputDate, today)) {
      return (
        new DatePipe('en-US').transform(inputDate, 'shortTime') ||
        inputDate.toString()
      );
    }
    if (this.sameDate(inputDate, yesterday)) {
      return 'Yesterday';
    }
    return (
      new DatePipe('en-US').transform(inputDate, 'MMM d') ||
      inputDate.toString()
    );
  }

  sameDate(someDate: Date, someOtherDate: Date): boolean {
    return (
      someDate.getDate() === someOtherDate.getDate() &&
      someDate.getMonth() === someOtherDate.getMonth() &&
      someDate.getFullYear() === someOtherDate.getFullYear()
    );
  }
}
