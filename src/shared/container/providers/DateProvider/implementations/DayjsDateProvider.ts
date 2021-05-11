import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';

import IDateProvider from "../IDateProvider";

dayjs.extend(utc);

export default class DayjsDateProvider implements IDateProvider {
  dateNow() {
    return dayjs().toDate();
  }

  formatToUTC(date: Date) {
    return (
      dayjs(date)
        .utc()
        .local()
        .format()
    );
  }

  comparisonResultInHours(start_date: Date, end_date: Date): number {
    return (
      dayjs(
        this.formatToUTC(end_date)
      ).diff(
        this.formatToUTC(start_date),
        'hours'
      )
    );
  }

  comparisonResultInDays(start_date: Date, end_date: Date): number {
    return (
      dayjs(
        this.formatToUTC(end_date)
      ).diff(
        this.formatToUTC(start_date),
        'days'
      )
    );
  }
}
