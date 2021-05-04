import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';

import IDateProvider from "../IDateProvider";

dayjs.extend(utc);

export default class DayjsDateProvider implements IDateProvider {
  formatToUTC(date?: Date) {
    return (
      date ? 
        dayjs(date)
          .utc()
          .local()
          .format()
        :
        // default is current date
        dayjs().utc().local().format()
    );
  }

  comparisonResultInHours(date: Date, compareDate?: Date) {
    // default compareDate is current date

    return (
      dayjs(
        this.formatToUTC(date)
      ).diff(
        this.formatToUTC(compareDate && compareDate),
        'hours'
      )
    );
  }
}
