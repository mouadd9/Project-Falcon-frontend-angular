import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: false
})
export class TimeAgoPipe implements PipeTransform {
  timeDiffs = {
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    year: 365 * 24 * 60 * 60 * 1000
  };

  transform(value: string | Date): any {
    const now = Date.now();
    const then = new Date(value).getTime();
    const diff = now - then;
    if (diff < this.timeDiffs.minute) {
      return 'seconds ago';
    } else if (diff < this.timeDiffs.hour) {
      return 'minutes ago';
    } else if (diff < this.timeDiffs.day) {
      return 'hours ago';
    } else if (diff < this.timeDiffs.week) {
      return 'days ago';
    } else if (diff < this.timeDiffs.month) {
      return 'weeks ago';
    } else if (diff < this.timeDiffs.year) {
      return 'months ago';
    } else {
      return 'years ago';
    }
  }
}