export default interface IDateProvider {
  dateNow(): Date;
  formatToUTC(date: Date): string,
  comparisonResultInHours(start_date: Date, end_date: Date): number;
  comparisonResultInDays(start_date: Date, end_date: Date): number;
  addDaysFromNow(days: number): Date;
  addHoursFromNow(hours: number): Date;
  comparePrecedenceBetweenDates(
    expected_before: Date,
    expected_after: Date
  ): boolean;
}
