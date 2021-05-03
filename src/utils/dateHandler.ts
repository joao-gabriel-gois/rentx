import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';

function formatToUTC(date?: Date) {
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

function set() {
  dayjs.extend(utc);
}

function comparisonResultInHours(date: Date, compareDate?: Date) {
  // default compareDate is current date
  return (
    dayjs(
      formatToUTC(date)
    ).diff(
      formatToUTC(compareDate && compareDate),
      'hours'
    )
  );
}

export default {
  formatToUTC,
  set,
  comparisonResultInHours
};
