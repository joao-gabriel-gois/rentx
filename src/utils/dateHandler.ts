export const parseMonth = (month: number) => {
  if (`${month}`.length < 2) {
    return `0${month}`
  }

  return `${month}`;
};

export const getDateObj = (date: Date) => {
  return {
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear()
  }
};
