// export const parseOneDigitNumberToTwoCharsStr = (value: number) => {
//   return `${value}`.padStart(2, '0');
// };

// export const getDateObj = (date: Date) => {
//   const dateObj =  {
//     day: parseOneDigitNumberToTwoCharsStr(date.getDate()),
//     month: parseOneDigitNumberToTwoCharsStr(date.getMonth()),
//     year: String(date.getFullYear())
//   }

//   const { day, month, year } = dateObj;

//   return {
//     dateObj,
//     dateStr: `${year}-${month}-${day}`
//   }
// };

export default (days: number, date = new Date()) => {
  const dateTimestamp = date.getTime();

  const daysInMs = days * 24 * 60 * 60 * 1000;

  return new Date(dateTimestamp + daysInMs);
};
