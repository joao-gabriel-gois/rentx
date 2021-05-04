export default interface IDateProvider {
  formatToUTC(date?: Date): string,
  comparisonResultInHours(date: Date, compareDate?: Date): number;
}